import moment from 'moment';
import mssqlConnection from '../dbs/mssql.connect';
import { ContainerEntity } from '../entity/container.entity';
import { DeliverOrderEntity } from '../entity/deliver-order.entity';
import { DeliveryOrderDtlEntity } from '../entity/delivery-order-detail.entity';
import { InvNoEntity } from '../entity/inv_vat.entity';
import { InvNoDtlEntity } from '../entity/inv_vat_dtl.entity';
import { Package as PackageEntity } from '../entity/package.entity';
import { TariffEntity } from '../entity/tariff.entity';
import { TariffDisEntity } from '../entity/tariffDis.entity';
import { User } from '../entity/user.entity';
import {
  DateRange,
  DeliverOrder,
  ExportedOrder,
  ImportedOrder,
  OrderReqIn,
  whereExManifest,
} from '../models/deliver-order.model';
import { DeliverOrderDetail } from '../models/delivery-order-detail.model';
import { InvVat, Payment } from '../models/inv_vat.model';
import { InvVatDtl, PaymentDtl } from '../models/inv_vat_dtl.model';
import { genOrderNo } from '../utils/genKey';
import { containerRepository } from './container.repo';
import { methodRepository } from './method.repo';
import { Tariff } from '../models/tariff.model';
import { PalletStockEntity } from '../entity/pallet-stock.entity';
import { JobQuantityCheckEntity } from '../entity/job-quantity-check.entity';
import { BadRequestError } from '../core/error.response';

const orderRepository = mssqlConnection.getRepository(DeliverOrderEntity);
const orderDtlRepository = mssqlConnection.getRepository(DeliveryOrderDtlEntity);
const contRepository = mssqlConnection.getRepository(ContainerEntity);
const packageRepository = mssqlConnection.getRepository(PackageEntity);
const tariffRepository = mssqlConnection.getRepository(TariffEntity);
const tariffDisRepository = mssqlConnection.getRepository(TariffDisEntity);
const invNoRepository = mssqlConnection.getRepository(InvNoEntity);
const invNoDtlRepository = mssqlConnection.getRepository(InvNoDtlEntity);
const palletRepository = mssqlConnection.getRepository(PalletStockEntity);
const jobQtyRepository = mssqlConnection.getRepository(JobQuantityCheckEntity);

const createfakeOrderData = async (data: DeliverOrder[]) => {
  const order = orderRepository.create(data);

  const newOrer = await orderRepository.save(order);
  return newOrer;
};

const findOrder = async () => {
  return await orderRepository.find();
};

const findMaxOrderNo = async () => {
  const maxLastFourDigits = await orderRepository
    .createQueryBuilder('order')
    .select('MAX(CAST(RIGHT(order.DE_ORDER_NO, 4) AS INT))', 'lastThreeDigits')
    .where('MONTH(order.CREATE_DATE) = MONTH(GETDATE())')
    .getRawOne();
  return maxLastFourDigits;
};

const findMaxDraftNo = async () => {
  const maxDraftNo = await orderRepository
    .createQueryBuilder('order')
    .select('Max(CAST(order.DRAFT_NO as int))', 'maxDraftNo')
    .where('YEAR(order.CREATE_DATE) = YEAR(GETDATE())')
    .getRawOne();
  return maxDraftNo;
};

// Tìm những cont có thể làm lệnh theo billoflading
const getContList = async (VOYAGEKEY: string, BILLOFLADING: string) => {
  const contList = contRepository
    .createQueryBuilder('cn')
    .leftJoin('DELIVER_ORDER', 'dto', 'cn.ROWGUID = dto.CONTAINER_ID')
    .where('cn.VOYAGEKEY = :voyagekey', { voyagekey: VOYAGEKEY })
    .andWhere('cn.BILLOFLADING = :bill', { bill: BILLOFLADING })
    //điều kiện kép
    // .andWhere(
    //   new Brackets(subQr => {
    //     subQr.where('dto.JOB_CHK is null').orWhere('dto.JOB_CHK = :job', { job: 0 });
    //   }),
    // )
    .andWhere('dto.CONTAINER_ID is null')
    .select([
      'dto.JOB_CHK',
      'cn.BILLOFLADING as BILLOFLADING',
      'cn.CNTRNO as CNTRNO',
      'cn.CNTRSZTP as CNTRSZTP',
      'cn.SEALNO as SEALNO',
      'cn.STATUSOFGOOD as STATUSOFGOOD',
      'cn.CONSIGNEE as CONSIGNEE',
      'cn.ITEM_TYPE_CODE as ITEM_TYPE_CODE',
      'cn.COMMODITYDESCRIPTION as COMMODITYDESCRIPTION',
    ])
    .getRawMany();
  return await contList;
};
// lấy dữ liệu của cont này ra. 1--check cont này đã làm lệnh chưa  2-- lấy dữ liệu ra
const checkContStatus = async (VOYAGEKEY: string, CNTRNO: string) => {
  const contArr = await contRepository
    .createQueryBuilder('cn')
    .leftJoin('DELIVER_ORDER', 'dto', 'cn.ROWGUID = dto.CONTAINER_ID')
    .where('cn.VOYAGEKEY = :voyagekey', { voyagekey: VOYAGEKEY })
    .andWhere('cn.CNTRNO = :cont', { cont: CNTRNO })
    .andWhere('dto.IS_VALID = 1')
    .andWhere('dto.CONTAINER_ID is not null')
    .select(['cn.ROWGUID'])
    .getRawMany();
  if (contArr.length) {
    return false;
  }
  return true;
};
const getManifestPackage = async (VOYAGEKEY: string, CNTRNO: string) => {
  const listMnf = packageRepository
    .createQueryBuilder('pk')
    .leftJoin('DT_CNTR_MNF_LD', 'cn', 'pk.CONTAINER_ID = cn.ROWGUID')
    .where('cn.VOYAGEKEY = :voyagekey', { voyagekey: VOYAGEKEY })
    .andWhere('cn.CNTRNO = :cont', { cont: CNTRNO })
    .select([
      'pk.ROWGUID as ROWGUID',
      'pk.PACKAGE_UNIT_CODE as PACKAGE_UNIT_CODE',
      'pk.ITEM_TYPE_CODE as ITEM_TYPE_CODE',
      'pk.CONTAINER_ID as CONTAINER_ID',
      'pk.HOUSE_BILL as HOUSE_BILL',
      'pk.CBM as CBM',
      'pk.DECLARE_NO as DECLARE_NO',
      'pk.CARGO_PIECE as CARGO_PIECE',
      'pk.NOTE as NOTE',
      'cn.CNTRSZTP as CNTRSZTP',
      'cn.BILLOFLADING as BILLOFLADING',
      'cn.ITEM_TYPE_CODE as ITEM_TYPE_CODE_CNTR',
      'cn.CNTRNO as CNTRNO',
    ])
    .getRawMany();
  return await listMnf;
};

const getTariffDis = async (whereObj: object) => {
  const tariffInfo = await tariffDisRepository.find({ where: whereObj }).then(data => {
    let current = moment().toDate().getTime();
    data = data.filter(item => {
      let arrayValidDate = item.TRF_TEMP_CODE.split('-');
      const from = moment(arrayValidDate[0], 'DD/MM/YYYY').toDate().getTime();
      const to = moment(arrayValidDate[1], 'DD/MM/YYYY').endOf('day').toDate().getTime();
      return current >= from && current <= to;
    });
    if (data.length == 1) {
      return data[0];
    } else {
      return null;
    }
  });
  return tariffInfo;
};

const getTariffSTD = async (whereObj: object) => {
  const tariffInfo = await tariffRepository.find({ where: whereObj }).then(data => {
    let current = moment().toDate().getTime();
    data = data.filter(item => {
      let arrayValidDate = item.TRF_TEMP_CODE.split('-');
      const from = moment(arrayValidDate[0], 'DD/MM/YYYY').toDate().getTime();
      const to = moment(arrayValidDate[1], 'DD/MM/YYYY').endOf('day').toDate().getTime();
      return current >= from && current <= to;
    });
    if (data.length == 1) {
      return data[0];
    } else {
      return null;
    }
  });
  return tariffInfo;
};

const getServicesTariff = async (
  services: string,
  ITEM_TYPE_CODE: string,
  CUSTOMER_CODE: string,
) => {
  let tariff;
  tariff = await methodRepository
    .createQueryBuilder('mt')
    .innerJoin('CONFIG_ATTACH_SRV', 'atr', 'mt.METHOD_CODE = atr.ATTACH_SERVICE_CODE')
    .leftJoin('TRF_DIS', 'trd', 'mt.METHOD_CODE = trd.METHOD_CODE')
    .where('trd.ITEM_TYPE_CODE = :itemType', { itemType: ITEM_TYPE_CODE })
    .andWhere('atr.ROWGUID = :rowg', { rowg: services })
    .andWhere('trd.CUSTOMER_CODE = :customer', { customer: CUSTOMER_CODE })
    .select([
      'mt.METHOD_CODE as METHOD_CODE',
      'trd.TRF_DESC as TRF_DESC',
      'trd.AMT_CBM as AMT_CBM',
      'trd.VAT as VAT',
      'trd.INCLUDE_VAT as INCLUDE_VAT',
    ])
    .getRawMany();
  if (tariff.length !== 1) {
    tariff = await methodRepository
      .createQueryBuilder('mt')
      .innerJoin('CONFIG_ATTACH_SRV', 'atr', 'mt.METHOD_CODE = atr.ATTACH_SERVICE_CODE')
      .leftJoin('TRF_STD', 'trd', 'mt.METHOD_CODE = trd.METHOD_CODE')
      .where('trd.ITEM_TYPE_CODE = :itemType', { itemType: ITEM_TYPE_CODE })
      .andWhere('atr.ROWGUID = :rowg', { rowg: services })
      .select([
        'mt.METHOD_CODE as METHOD_CODE',
        'trd.TRF_DESC as TRF_DESC',
        'trd.AMT_CBM as AMT_CBM',
        'trd.VAT as VAT',
        'trd.INCLUDE_VAT as INCLUDE_VAT',
      ])
      .getRawMany();
  }
  return tariff;
};

const saveInOrder = async (
  reqData: OrderReqIn[],
  paymentInfoHeader: Payment,
  paymentInfoDetail: PaymentDtl[],
  createBy: User,
) => {
  const totalCbm = reqData.reduce((accumulator, item) => accumulator + item.CBM, 0);
  const orderNo = reqData[0].DE_ORDER_NO || (await genOrderNo('NK'));

  let deliveryOrder: DeliverOrder = {
    DE_ORDER_NO: String(orderNo),
    CUSTOMER_CODE: reqData[0].CUSTOMER_CODE,
    CONTAINER_ID: reqData[0].CONTAINER_ID,
    INV_ID: paymentInfoHeader.INV_NO ? paymentInfoHeader.INV_NO : null,
    INV_DRAFT_ID: reqData[0].INV_DRAFT_ID ? reqData[0].INV_DRAFT_ID : null,
    ISSUE_DATE: new Date(),
    EXP_DATE: reqData[0].EXP_DATE,
    TOTAL_CBM: totalCbm,
    JOB_CHK: false,
    CREATE_BY: createBy.ROWGUID,
    CREATE_DATE: new Date(),
    UPDATE_BY: createBy.ROWGUID,
    UPDATE_DATE: new Date(),
  };

  let deliveryOrderDtl: DeliverOrderDetail[] = reqData.map((item, idx) => ({
    // ROWGUID?: item.,
    DE_ORDER_NO: String(orderNo),
    METHOD_CODE: 'NK',
    HOUSE_BILL: item.HOUSE_BILL,
    CBM: item.CBM,
    LOT_NO: idx + 1,
    // QUANTITY_CHK: false,
    REF_PAKAGE: item.ROWGUID,
    CREATE_BY: createBy.ROWGUID,
    CREATE_DATE: new Date(),
    UPDATE_BY: createBy.ROWGUID,
    UPDATE_DATE: new Date(),
  }));

  let inv_vatSave: InvVat = {
    INV_NO: paymentInfoHeader.INV_NO,
    INV_DATE: paymentInfoHeader.INV_DATE,
    PAYER: reqData[0].CUSTOMER_CODE,
    AMOUNT: paymentInfoHeader.AMOUNT,
    VAT: paymentInfoHeader.VAT,
    TAMOUNT: paymentInfoHeader.TAMOUNT,
    PAYMENT_STATUS: 'Y',
    ACC_CD: paymentInfoHeader.ACC_CD,
    CREATE_BY: createBy.ROWGUID,
    CREATE_DATE: new Date(),
    UPDATE_BY: createBy.ROWGUID,
    UPDATE_DATE: new Date(),
  };

  let invVatDtlSave: InvVatDtl[] = paymentInfoDetail.map((item, idx) => ({
    AMOUNT: item.AMOUNT ? item.AMOUNT : null,
    CARGO_TYPE: item.CARGO_TYPE ? item.CARGO_TYPE : null,
    INV_ID: paymentInfoHeader.INV_NO ? paymentInfoHeader.INV_NO : null,
    QTY: item.QTY ? item.QTY : null,
    TAMOUNT: item.TAMOUNT,
    TRF_DESC: item.TRF_DESC ? item.TRF_DESC : null,
    UNIT_RATE: item.UNIT_RATE ? item.UNIT_RATE : null,
    VAT: item.VAT ? item.VAT : null,
    VAT_RATE: item.VAT_RATE ? item.VAT_RATE : null,
  }));

  const order = orderRepository.create(deliveryOrder);
  const orderDtl = orderDtlRepository.create(deliveryOrderDtl);
  const invInfo = invNoRepository.create(inv_vatSave);
  const invDtlInfo = invNoDtlRepository.create(invVatDtlSave);
  const neworder = await orderRepository.save(order);
  const neworderDtlTemp = await orderDtlRepository.save(orderDtl);
  const newInvInfo = await invNoRepository.save(invInfo);
  const newInvDtlInfo = await invNoDtlRepository.save(invDtlInfo);

  const neworderDtlIds = neworderDtlTemp.map(item => item.ROWGUID);
  const neworderDtl = await orderDtlRepository
    .createQueryBuilder('orderDtl')
    .leftJoinAndSelect('DT_PACKAGE_MNF_LD', 'pk', 'pk.ROWGUID = orderDtl.REF_PAKAGE')
    .leftJoinAndSelect('BS_ITEM_TYPE', 'item', 'pk.ITEM_TYPE_CODE = item.ITEM_TYPE_CODE')
    .where('orderDtl.ROWGUID IN (:...ids)', { ids: neworderDtlIds })
    .select([
      'orderDtl.ROWGUID as ROWGUID',
      'orderDtl.DE_ORDER_NO as DE_ORDER_NO',
      'orderDtl.METHOD_CODE as METHOD_CODE',
      'orderDtl.HOUSE_BILL as HOUSE_BILL',
      'orderDtl.CBM as CBM',
      'orderDtl.LOT_NO as LOT_NO',
      'pk.PACKAGE_UNIT_CODE as PACKAGE_UNIT_CODE',
      'pk.ITEM_TYPE_CODE as ITEM_TYPE_CODE',
      'pk.CONTAINER_ID as CONTAINER_ID',
      'pk.HOUSE_BILL as PK_HOUSE_BILL',
      'pk.CBM as PK_CBM',
      'pk.DECLARE_NO as PK_DECLARE_NO',
      'pk.CARGO_PIECE as PK_CARGO_PIECE',
      'pk.NOTE as PK_NOTE',
      'item.ITEM_TYPE_NAME as ITEM_TYPE_NAME',
    ])
    .orderBy('orderDtl.LOT_NO', 'ASC')
    .getRawMany();

  return {
    neworder,
    neworderDtl,
    newInvInfo,
    newInvDtlInfo,
  };
};
const checkPackageStatusOrder = async (whereExManifest: whereExManifest) => {
  const list = await packageRepository
    .createQueryBuilder('pk')
    .leftJoin('DT_CNTR_MNF_LD', 'cn', 'pk.CONTAINER_ID = cn.ROWGUID')
    .leftJoin('DELIVER_ORDER', 'dto', 'dto.PACKAGE_ID = pk.ROWGUID')
    .where('cn.VOYAGEKEY =:voy', { voy: whereExManifest.VOYAGEKEY })
    .andWhere('pk.HOUSE_BILL = :pack', { pack: whereExManifest.HOUSE_BILL })
    .andWhere('cn.ROWGUID = :cntrno', { cntrno: whereExManifest.CONTAINER_ID })
    .andWhere('dto.PACKAGE_ID is not null')
    .andWhere('dto.IS_VALID = 1')
    .select(['pk.ROWGUID'])
    .getRawMany();
  if (list.length) return false;
  return true;
};

const checkPalletOfHouseBill = async (whereExManifest: whereExManifest) => {
  const list = await packageRepository
    .createQueryBuilder('pk')
    .leftJoin('DT_CNTR_MNF_LD', 'cn', 'pk.CONTAINER_ID = cn.ROWGUID')
    .leftJoin('JOB_QUANTITY_CHECK', 'jk', 'pk.ROWGUID = jk.PACKAGE_ID')
    .leftJoin('DT_PALLET_STOCK', 'pl', 'jk.ROWGUID = pl.JOB_QUANTITY_ID')
    .where('cn.VOYAGEKEY =:voy', { voy: whereExManifest.VOYAGEKEY })
    .andWhere('pk.HOUSE_BILL = :pack', { pack: whereExManifest.HOUSE_BILL })
    .andWhere('cn.ROWGUID = :cntrno', { cntrno: whereExManifest.CONTAINER_ID })
    .andWhere('pl.PALLET_STATUS = :status', { status: 'I' })
    .select(['jk.JOB_STATUS as JOB_STATUS, pl.PALLET_STATUS  as PALLET_STATUS'])
    .getRawMany();
  if (list.length) return false;
  return true;
};

const getExManifest = async (whereObject: whereExManifest) => {
  const results = await packageRepository
    .createQueryBuilder()
    .where('CONTAINER_ID = :cont', { cont: whereObject.CONTAINER_ID })
    .andWhere('HOUSE_BILL = :house', { house: whereObject.HOUSE_BILL })
    .getMany();
  return results;
};

const saveExOrder = async (
  reqData: OrderReqIn[],
  paymentInfoHeader: Payment,
  paymentInfoDetail: PaymentDtl[],
  createBy: User,
) => {
  const totalCbm = reqData.reduce((accumulator, item) => accumulator + item.CBM, 0);
  const orderNo = reqData[0].DE_ORDER_NO || (await genOrderNo('XK'));

  if (reqData[0].ROWGUID) {
    packageRepository.update(reqData[0].ROWGUID, { JOB_TYPE: 'XK' }).catch(err => console.log(err));
  }
  let deliveryOrder: DeliverOrder = {
    DE_ORDER_NO: String(orderNo),
    CUSTOMER_CODE: reqData[0].CUSTOMER_CODE,
    CONTAINER_ID: reqData[0].CONTAINER_ID,
    PACKAGE_ID: reqData[0].PACKAGE_ID ? reqData[0].PACKAGE_ID : null,
    INV_ID: paymentInfoHeader.INV_NO ? paymentInfoHeader.INV_NO : null,
    INV_DRAFT_ID: reqData[0].INV_DRAFT_ID ? reqData[0].INV_DRAFT_ID : null,
    ISSUE_DATE: new Date(),
    EXP_DATE: reqData[0].EXP_DATE,
    TOTAL_CBM: totalCbm,
    JOB_CHK: false,
    CREATE_BY: createBy.ROWGUID,
    CREATE_DATE: new Date(),
    UPDATE_BY: createBy.ROWGUID,
    UPDATE_DATE: new Date(),
  };

  let deliveryOrderDtl: DeliverOrderDetail[] = reqData.map((item, idx) => ({
    // ROWGUID?: item.,
    DE_ORDER_NO: String(orderNo),
    METHOD_CODE: 'XK',
    HOUSE_BILL: item.HOUSE_BILL,
    CBM: item.CBM,
    LOT_NO: idx + 1,
    // QUANTITY_CHK: false,
    REF_PAKAGE: item.ROWGUID,
    CREATE_BY: createBy.ROWGUID,
    CREATE_DATE: new Date(),
    UPDATE_BY: createBy.ROWGUID,
    UPDATE_DATE: new Date(),
  }));

  let inv_vatSave: InvVat = {
    INV_NO: paymentInfoHeader.INV_NO,
    INV_DATE: paymentInfoHeader.INV_DATE,
    PAYER: reqData[0].CUSTOMER_CODE,
    AMOUNT: paymentInfoHeader.AMOUNT,
    VAT: paymentInfoHeader.VAT,
    TAMOUNT: paymentInfoHeader.TAMOUNT,
    PAYMENT_STATUS: 'Y',
    ACC_CD: paymentInfoHeader.ACC_CD,
    CREATE_BY: createBy.ROWGUID,
    CREATE_DATE: new Date(),
    UPDATE_BY: createBy.ROWGUID,
    UPDATE_DATE: new Date(),
  };

  let invVatDtlSave: InvVatDtl[] = paymentInfoDetail.map((item, idx) => ({
    AMOUNT: item.AMOUNT,
    CARGO_TYPE: item.CARGO_TYPE,
    INV_ID: paymentInfoHeader.INV_NO ? paymentInfoHeader.INV_NO : null,
    QTY: item.QTY,
    TAMOUNT: item.TAMOUNT,
    TRF_DESC: item.TRF_DESC,
    UNIT_RATE: item.UNIT_RATE,
    VAT: item.VAT,
    VAT_RATE: item.VAT_RATE,
  }));

  const order = orderRepository.create(deliveryOrder);
  const orderDtl = orderDtlRepository.create(deliveryOrderDtl);
  const invInfo = invNoRepository.create(inv_vatSave);
  const invDtlInfo = invNoDtlRepository.create(invVatDtlSave);
  const neworder = await orderRepository.save(order);
  const neworderDtlTemp = await orderDtlRepository.save(orderDtl);
  const newInvInfo = await invNoRepository.save(invInfo);
  const newInvDtlInfo = await invNoDtlRepository.save(invDtlInfo);

  const neworderDtlIds = neworderDtlTemp.map(item => item.ROWGUID);
  const neworderDtl = await orderDtlRepository
    .createQueryBuilder('orderDtl')
    .leftJoinAndSelect('DT_PACKAGE_MNF_LD', 'pk', 'pk.ROWGUID = orderDtl.REF_PAKAGE')
    .leftJoinAndSelect('BS_ITEM_TYPE', 'item', 'pk.ITEM_TYPE_CODE = item.ITEM_TYPE_CODE')
    .where('orderDtl.ROWGUID IN (:...ids)', { ids: neworderDtlIds })
    .select([
      'orderDtl.ROWGUID as ROWGUID',
      'orderDtl.DE_ORDER_NO as DE_ORDER_NO',
      'orderDtl.METHOD_CODE as METHOD_CODE',
      'orderDtl.HOUSE_BILL as HOUSE_BILL',
      'orderDtl.CBM as CBM',
      'orderDtl.LOT_NO as LOT_NO',
      'pk.PACKAGE_UNIT_CODE as PACKAGE_UNIT_CODE',
      'pk.ITEM_TYPE_CODE as ITEM_TYPE_CODE',
      'pk.CONTAINER_ID as CONTAINER_ID',
      'pk.HOUSE_BILL as PK_HOUSE_BILL',
      'pk.CBM as PK_CBM',
      'pk.DECLARE_NO as PK_DECLARE_NO',
      'pk.CARGO_PIECE as PK_CARGO_PIECE',
      'pk.NOTE as PK_NOTE',
      'item.ITEM_TYPE_NAME as ITEM_TYPE_NAME',
    ])
    .orderBy('orderDtl.LOT_NO', 'ASC')
    .getRawMany();

  return {
    neworder,
    neworderDtl,
    newInvInfo,
    newInvDtlInfo,
  };
};

const getOrderContList = async (VOYAGEKEY: string) => {
  let results = await containerRepository
    .createQueryBuilder('cn')
    .innerJoin('DT_PACKAGE_MNF_LD', 'pk', 'cn.ROWGUID = pk.CONTAINER_ID')
    .leftJoin('JOB_QUANTITY_CHECK', 'jq', 'pk.ROWGUID = jq.PACKAGE_ID')
    .leftJoin('DT_PALLET_STOCK', 'pl', 'jq.ROWGUID = pl.JOB_QUANTITY_ID')
    .where('pl.PALLET_STATUS = :status', { status: 'S' })
    .andWhere('cn.VOYAGEKEY = :VOYAGE_KEY', { VOYAGE_KEY: VOYAGEKEY })
    .select([
      'cn.CNTRNO as CNTRNO',
      'pk.HOUSE_BILL as HOUSE_BILL',
      'pk.CBM as CBM',
      'pk.ITEM_TYPE_CODE as ITEM_TYPE_CODE',
      'pk.CONTAINER_ID as CONTAINER_ID',
      'pk.ROWGUID as ROWGUID',
      'pk.DECLARE_NO as DECLARE_NO',
      'pk.PACKAGE_UNIT_CODE as PACKAGE_UNIT_CODE',
      'pl.PALLET_STATUS as PALLET_STATUS',
    ])
    .groupBy('cn.CNTRNO')
    .addGroupBy('pk.HOUSE_BILL')
    .addGroupBy('pk.CBM')
    .addGroupBy('pk.ITEM_TYPE_CODE')
    .addGroupBy('pk.CONTAINER_ID')
    .addGroupBy('pk.ROWGUID')
    .addGroupBy('pk.DECLARE_NO')
    .addGroupBy('pk.PACKAGE_UNIT_CODE')
    .addGroupBy('pl.PALLET_STATUS')
    .getRawMany();

  if (results.length) {
    for (let i = 0; i < results.length; i++) {
      let temp = await orderRepository
        .createQueryBuilder()
        .where('CONTAINER_ID = :contid', { contid: results[i].CONTAINER_ID })
        .andWhere('IS_VALID = 1')
        .andWhere('PACKAGE_ID = :package', { package: results[i].ROWGUID })
        .select(['PACKAGE_ID'])
        .getRawMany();
      if (temp.length) {
        results = results.filter(item => item.ROWGUID !== temp[0].PACKAGE_ID);
      }
    }
  }

  return results;
};

const findOrdersByCustomerCode = async (customerCode: string, date: DateRange) => {
  const queryBuilder = orderRepository
    .createQueryBuilder('order')
    .where('order.CUSTOMER_CODE = :customerCode', { customerCode: customerCode });

  if (date.from && date.to) {
    queryBuilder.andWhere('order.ISSUE_DATE >= :fromDate', { fromDate: date['from'] });
    queryBuilder.andWhere('order.ISSUE_DATE <= :toDate', { toDate: date['to'] });
  }

  return await queryBuilder.getMany();
};

const findImportedOrdersByStatus = async (customerCode: string): Promise<ImportedOrder[]> => {
  const query = `SELECT
      do.DE_ORDER_NO,
      do.CUSTOMER_CODE,
      do.CONTAINER_ID,
      do.PACKAGE_ID AS DO_PACKAGE_ID,
      do.INV_ID,
      do.ISSUE_DATE,
      do.EXP_DATE,
      do.TOTAL_CBM,
      do.JOB_CHK,
      do.NOTE, 
      COUNT(DISTINCT dod.REF_PAKAGE) AS TOTAL_PACKAGES,
      COUNT(DISTINCT jqc.PACKAGE_ID) AS TOTAL_JOBS_BY_PACKAGE,
      COUNT(DISTINCT jqc.ROWGUID) AS TOTAL_JOBS,
      SUM(CASE WHEN jqc.JOB_STATUS = 'C' THEN 1 ELSE 0 END) AS CHECKED_JOBS,
      SUM(CASE WHEN ps.PALLET_STATUS = 'S' THEN 1 ELSE 0 END) AS STORED_PALLETS,
      COUNT(DISTINCT CASE WHEN ps.PALLET_STATUS != 'C' THEN ps.PALLET_NO END) AS TOTAL_PALLETS
  FROM
      DELIVER_ORDER do
  JOIN
      DELIVERY_ORDER_DETAIL dod ON do.DE_ORDER_NO = dod.DE_ORDER_NO
  LEFT JOIN
      JOB_QUANTITY_CHECK jqc ON dod.REF_PAKAGE = jqc.PACKAGE_ID
  LEFT JOIN
      DT_PALLET_STOCK ps ON jqc.ROWGUID = ps.JOB_QUANTITY_ID
  WHERE
      do.CUSTOMER_CODE = '${customerCode}'
      and do.DE_ORDER_NO like 'NK%'
  GROUP BY
      do.DE_ORDER_NO, do.CUSTOMER_CODE, do.CONTAINER_ID, do.PACKAGE_ID, do.INV_ID, 
    do.ISSUE_DATE, do.EXP_DATE, do.TOTAL_CBM, do.JOB_CHK, do.NOTE`;

  const queryRunner = await mssqlConnection.createQueryRunner();
  try {
    const orders = await queryRunner.manager.query(query);
    return orders;
  } finally {
    await queryRunner.release();
  }
};

const findExportedOrdersByStatus = async (customerCode: string): Promise<ExportedOrder[]> => {
  const query = `
    SELECT 
      do.DE_ORDER_NO,
      do.CUSTOMER_CODE,
      do.CONTAINER_ID,
      do.PACKAGE_ID,
      do.INV_ID,
      do.ISSUE_DATE,
      do.EXP_DATE,
      do.TOTAL_CBM,
      do.JOB_CHK,
      do.NOTE, 
      COUNT(DISTINCT jqc.ROWGUID) AS TOTAL_JOBS,
      COUNT(DISTINCT ps.PALLET_NO) AS TOTAL_PALLETS,
      SUM(CASE WHEN ps.PALLET_STATUS = 'C' THEN 1 ELSE 0 END) AS RELEASED_PALLETS
    FROM 
      DELIVER_ORDER do
    LEFT JOIN
      JOB_QUANTITY_CHECK jqc ON do.PACKAGE_ID = jqc.PACKAGE_ID
    LEFT JOIN 
      DT_PALLET_STOCK ps ON jqc.ROWGUID = ps.JOB_QUANTITY_ID
    WHERE 
      do.CUSTOMER_CODE = '${customerCode}'
      AND do.DE_ORDER_NO LIKE 'XK%'
    GROUP BY 
      do.DE_ORDER_NO, do.CUSTOMER_CODE, do.CONTAINER_ID, do.PACKAGE_ID, do.INV_ID, 
    do.ISSUE_DATE, do.EXP_DATE, do.TOTAL_CBM, do.JOB_CHK, do.NOTE
  `;

  const queryRunner = await mssqlConnection.createQueryRunner();
  try {
    const orders = await queryRunner.manager.query(query);
    return orders;
  } finally {
    await queryRunner.release();
  }
};

const findOrderByOrderNo = async (orderNo: string) => {
  const order = await orderRepository.findOne({
    where: { DE_ORDER_NO: orderNo },
  });
  return order;
};

export type ReportInEx = {
  fromDate: Date;
  toDate: Date;
  CNTRNO?: string;
  CUSTOMER_CODE?: string;
  isInEx: '' | 'I' | 'E';
};
const getReportInExOrder = async (whereObj: ReportInEx) => {
  let query = orderRepository
    .createQueryBuilder('dto')
    .leftJoin('DT_CNTR_MNF_LD', 'cn', 'cn.ROWGUID = dto.CONTAINER_ID')
    .leftJoin('BS_CUSTOMER', 'cus', 'cus.CUSTOMER_CODE = dto.CUSTOMER_CODE')
    .select([
      'dto.DE_ORDER_NO as DE_ORDER_NO',
      'dto.INV_ID as INV_ID',
      'cn.CNTRNO as CNTRNO',
      'cus.CUSTOMER_NAME as CUSTOMER_NAME',
      'dto.ISSUE_DATE as ISSUE_DATE',
    ])
    .where('dto.ISSUE_DATE >= :fromDate', { fromDate: whereObj.fromDate })
    .andWhere('dto.ISSUE_DATE <= :toDate', { toDate: whereObj.toDate })
    .orderBy('dto.UPDATE_DATE', 'DESC');
  if (whereObj.CNTRNO) {
    query = query.andWhere('cn.CNTRNO LIKE :cnt', { cnt: `%${whereObj.CNTRNO}%` });
  }
  if (whereObj.CUSTOMER_CODE) {
    query = query.andWhere('cus.CUSTOMER_CODE = :customer', { customer: whereObj.CUSTOMER_CODE });
  }
  let temp = await query.getRawMany();
  if (whereObj.isInEx) {
    if (whereObj.isInEx == 'I') {
      temp = temp.filter(item => item.DE_ORDER_NO.includes('NK'));
    } else {
      temp = temp.filter(item => item.DE_ORDER_NO.includes('XK'));
    }
  }
  return temp;
};

const cancelOrder = async (InvNo: string, cancelReason: string) => {
  await orderRepository
    .createQueryBuilder()
    .update(DeliverOrderEntity)
    .set({ IS_VALID: false })
    .where('INV_ID = :invno', { invno: InvNo })
    .execute()
    .catch(err => console.log(err));

  await invNoRepository
    .createQueryBuilder()
    .update(InvNoEntity)
    .set({ PAYMENT_STATUS: 'C', CANCEL_DATE: new Date(), CANCLE_REMARK: cancelReason })
    .where('INV_NO = :invno', { invno: InvNo })
    .execute();

  const packageID = await orderRepository
    .createQueryBuilder('dt')
    .innerJoin('DT_PACKAGE_MNF_LD', 'pk', 'pk.ROWGUID = dt.PACKAGE_ID')
    .select(['dt.PACKAGE_ID as PACKAGE_ID'])
    .where('INV_ID = :inv', { inv: InvNo })
    .andWhere('LEFT(dt.DE_ORDER_NO, 2) = :keystring', { keystring: 'XK' })
    .getRawMany();
  if (packageID.length) {
    await packageRepository
      .update(packageID[0].PACKAGE_ID, { JOB_TYPE: 'NK' })
      .catch(err => console.log(err));
  }
};

const checkPackageCanCelOrder = async (packageID: string) => {
  const DE_ORDER_NO = await orderRepository
    .createQueryBuilder('dt')
    .leftJoin('DT_CNTR_MNF_LD', 'cn', 'dt.CONTAINER_ID = cn.ROWGUID')
    .leftJoin('DT_PACKAGE_MNF_LD', 'pk', 'dt.CONTAINER_ID = pk.CONTAINER_ID')
    .select(['dt.IS_VALID as IS_VALID'])
    .where('pk.ROWGUID = :row', { row: packageID })
    .andWhere('LEFT(dt.DE_ORDER_NO, 2) = :keystring', { keystring: 'NK' })
    .getRawMany();
  if (DE_ORDER_NO.length) {
    return DE_ORDER_NO.filter(e => e.IS_VALID == true).length
      ? DE_ORDER_NO.filter(e => e.IS_VALID == true)[0].IS_VALID
      : false;
  } else {
    return false;
  }
};

const updateCanCancelImport = async (packageID: string) => {
  const DE_ORDER_NO = await orderRepository
    .createQueryBuilder('dt')
    .leftJoin('DT_CNTR_MNF_LD', 'cn', 'dt.CONTAINER_ID = cn.ROWGUID')
    .leftJoin('DT_PACKAGE_MNF_LD', 'pk', 'dt.CONTAINER_ID = pk.CONTAINER_ID')
    .select(['dt.DE_ORDER_NO as DE_ORDER_NO'])
    .where('pk.ROWGUID = :row', { row: packageID })
    .andWhere('dt.IS_VALID = 1')
    .andWhere('LEFT(dt.DE_ORDER_NO, 2) = :keystring', { keystring: 'NK' })
    .getRawMany();
  if (DE_ORDER_NO.length) {
    return await orderRepository
      .createQueryBuilder()
      .update(DeliverOrderEntity)
      .set({ CAN_CANCEL: false })
      .where('DE_ORDER_NO = :orderno', { orderno: DE_ORDER_NO[0]?.DE_ORDER_NO })
      .execute()
      .catch(err => console.log(err));
  } else {
    return 0;
  }
};

const updateCanCancelExport = async (packageID: string) => {
  return await orderRepository
    .createQueryBuilder()
    .update(DeliverOrderEntity)
    .set({ CAN_CANCEL: false })
    .where('PACKAGE_ID = :packageid', { packageid: packageID })
    .execute()
    .catch(err => console.log(err));
};

export type CancelInvoiceWhere = {
  from: Date;
  to: Date;
  CUSTOMER_CODE?: string;
  PAYMENT_STATUS?: '' | 'Y' | 'C';
  DE_ORDER_NO: string;
};
const getCancelInvoice = async (whereObj: CancelInvoiceWhere) => {
  let query = orderRepository
    .createQueryBuilder('dt')
    .leftJoin('INV_VAT', 'iv', 'iv.INV_NO = dt.INV_ID')
    .leftJoin('BS_CUSTOMER', 'cus', 'iv.PAYER = cus.CUSTOMER_CODE')
    .select([
      'dt.INV_ID as INV_ID',
      'dt.DE_ORDER_NO as DE_ORDER_NO',
      'iv.INV_DATE as INV_DATE',
      'iv.AMOUNT as AMOUNT',
      'iv.VAT as VAT',
      'iv.TAMOUNT as TAMOUNT',
      'cus.CUSTOMER_NAME as CUSTOMER_NAME',
      'iv.PAYMENT_STATUS as PAYMENT_STATUS',
      'iv.CANCEL_DATE as CANCEL_DATE',
      'iv.CANCLE_REMARK as CANCLE_REMARK',
    ])
    .orderBy('iv.INV_DATE', 'DESC')
    .where('CAN_CANCEL = 1');
  if (whereObj.CUSTOMER_CODE) {
    query = query.andWhere('iv.PAYER = :cus', { cus: whereObj.CUSTOMER_CODE });
  }

  if (whereObj.from && whereObj.to) {
    query = query
      .andWhere('dt.ISSUE_DATE >= :fromDate', { fromDate: whereObj.from })
      .andWhere('dt.ISSUE_DATE <= :toDate', { toDate: whereObj.to });
  }
  if (whereObj.DE_ORDER_NO) {
    query = query.andWhere('dt.DE_ORDER_NO like :order', { order: `%${whereObj.DE_ORDER_NO}%` });
  }
  if (whereObj.PAYMENT_STATUS) {
    query = query.andWhere('iv.PAYMENT_STATUS = :pay', { pay: whereObj.PAYMENT_STATUS });
  }
  return await query.getRawMany();
};

const checkIsValidExportPallet = async (palletNo: string) => {
  const pallet = await palletRepository
    .createQueryBuilder('pallet')
    .innerJoin('JOB_QUANTITY_CHECK', 'job', 'job.ROWGUID = pallet.JOB_QUANTITY_ID')
    .select(['job.PACKAGE_ID as PACKAGE_ID'])
    .where('pallet.PALLET_NO = :palletNo', { palletNo })
    .getRawOne();

  console.log(pallet);

  const order = await orderRepository
    .createQueryBuilder('order')
    .where('order.PACKAGE_ID = :packageId', { packageId: pallet.PACKAGE_ID })
    .getOne();

  if (!order) {
    throw new BadRequestError('Pallet không hợp lệ!');
  }

  return order.IS_VALID;
};

export {
  checkContStatus,
  checkPackageStatusOrder,
  createfakeOrderData,
  findExportedOrdersByStatus,
  findImportedOrdersByStatus,
  findMaxDraftNo,
  findMaxOrderNo,
  findOrder,
  findOrderByOrderNo,
  findOrdersByCustomerCode,
  getContList,
  getExManifest,
  getManifestPackage,
  getOrderContList,
  getServicesTariff,
  getTariffDis,
  getTariffSTD,
  saveExOrder,
  saveInOrder,
  checkPalletOfHouseBill,
  getReportInExOrder,
  cancelOrder,
  getCancelInvoice,
  updateCanCancelImport,
  updateCanCancelExport,
  checkPackageCanCelOrder,
  checkIsValidExportPallet,
};
