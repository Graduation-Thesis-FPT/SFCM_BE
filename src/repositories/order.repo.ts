import mssqlConnection from '../db/mssql.connect';
import { DeliverOrderEntity } from '../entity/deliver-order.entity';
import { DeliveryOrderDtlEntity } from '../entity/delivery-order-detail.entity';
import { ContainerEntity } from '../entity/container.entity';
import { Package as PackageEntity } from '../entity/package.entity';
import { TariffEntity } from '../entity/tariff.entity';
import { InvNoEntity } from '../entity/inv_vat.entity';
import { InvNoDtlEntity } from '../entity/inv_vat_dtl.entity';
import { DeliverOrder, OrderReqIn, whereExManifest } from '../models/deliver-order.model';
import moment from 'moment';
import { DeliverOrderDetail } from '../models/delivery-order-detail.model';
import { User } from '../entity/user.entity';
import { genOrderNo } from '../utils/genKey';
import { InvVat, Payment } from '../models/inv_vat.model';
import { InvVatDtl, PaymentDtl } from '../models/inv_vat_dtl.model';
import { containerRepository } from './container.repo';

export const orderRepository = mssqlConnection.getRepository(DeliverOrderEntity);
export const orderDtlRepository = mssqlConnection.getRepository(DeliveryOrderDtlEntity);
export const contRepository = mssqlConnection.getRepository(ContainerEntity);
export const packageRepository = mssqlConnection.getRepository(PackageEntity);
export const tariffRepository = mssqlConnection.getRepository(TariffEntity);
export const invNoRepository = mssqlConnection.getRepository(InvNoEntity);
export const invNoDtlRepository = mssqlConnection.getRepository(InvNoDtlEntity);

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
    .leftJoin('DELIVER_ORDER', 'dto', 'cn.ROWGUID = dto.CONTAINER_ID and dto.JOB_CHK <> 1')
    .where('cn.VOYAGEKEY = :voyagekey', { voyagekey: VOYAGEKEY })
    .andWhere('cn.BILLOFLADING = :bill', { bill: BILLOFLADING })
    .select([
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
    .leftJoin('DELIVER_ORDER', 'dto', 'cn.ROWGUID = dto.CONTAINER_ID and dto.JOB_CHK <> 1')
    .where('cn.VOYAGEKEY = :voyagekey', { voyagekey: VOYAGEKEY })
    .andWhere('cn.CNTRNO = :cont', { cont: CNTRNO })
    .select(['cn.*'])
    .getRawMany();
  if (contArr.length) return false;
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

const getTariffSTD = async (whereObj: object) => {
  const tariffInfo = await tariffRepository.find({ where: whereObj }).then(data => {
    let current = moment().toDate().getTime();
    // data = data.filter(item => {
    //   let from = moment(item.FROM_DATE, 'DD/MM/YYYY').toDate().getTime();
    //   let to = moment(item.TO_DATE, 'DD/MM/YYYY').endOf('day').toDate().getTime();
    //   return current >= from && current <= to;
    // });
    if (data.length == 1) {
      return data[0];
    } else {
      return null;
    }
  });
  return tariffInfo;
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
    CREATE_BY: 'sql',
    CREATE_DATE: new Date(),
    UPDATE_BY: 'sql',
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
    CREATE_BY: 'sql',
    CREATE_DATE: new Date(),
    UPDATE_BY: 'sql',
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
    CREATE_BY: 'sql',
    CREATE_DATE: new Date(),
    UPDATE_BY: 'sql',
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
  const invDtlInfo = invNoRepository.create(invVatDtlSave);
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

const getExManifest = async (whereObject: whereExManifest) => {
  const list = await packageRepository
    .createQueryBuilder('pk')
    .where('pk.VOYAGEKEY = :voyagekey', { voyagekey: whereObject.VOYAGEKEY })
    .where('pk.CONTAINER_ID = :container', { container: whereObject.CONTAINER_ID })
    .where('pk.HOUSE_BILL = :housebill', { housebill: whereObject.HOUSE_BILL })
    .select(['pk.*'])
    .getRawMany();
  return list;
};

const saveExOrder = async (
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
    CREATE_BY: 'sql',
    CREATE_DATE: new Date(),
    UPDATE_BY: 'sql',
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
    CREATE_BY: 'sql',
    CREATE_DATE: new Date(),
    UPDATE_BY: 'sql',
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
    CREATE_BY: 'sql',
    CREATE_DATE: new Date(),
    UPDATE_BY: 'sql',
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
  const invDtlInfo = invNoRepository.create(invVatDtlSave);
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
  const list = await containerRepository
    .createQueryBuilder('cn')
    .leftJoin('DELIVER_ORDER', 'dor', 'cn.ROWGUID = dor.CONTAINER_ID')
    .where('dor.JOB_CHK = :JOB_CHK', { JOB_CHK: 1 })
    .where('cn.VOYAGE_KEY = :VOYAGE_KEY', { VOYAGE_KEY: VOYAGEKEY })
    .select([
      'cn.BILLOFLADING as BILLOFLADING',
      'cn.SEALNO as SEALNO',
      'cn.CNTRSZTP as CNTRSZTP',
      'cn.ITEM_TYPE_CODE as ITEM_TYPE_CODE',
      'cn.CNTRNO as CNTRNO',
      'cn.COMMODITYDESCRIPTION as COMMODITYDESCRIPTION',
      'dor.JOB_CHK as JOB_CHK',
    ])
    .getRawMany();
  return list;
};

export {
  createfakeOrderData,
  findOrder,
  findMaxOrderNo,
  findMaxDraftNo,
  getContList,
  checkContStatus,
  getManifestPackage,
  getTariffSTD,
  saveInOrder,
  getExManifest,
  saveExOrder,
  getOrderContList,
};
