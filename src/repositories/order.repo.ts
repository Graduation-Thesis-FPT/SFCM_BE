import mssqlConnection from '../db/mssql.connect';
import { DeliverOrderEntity } from '../entity/deliver-order.entity';
import { DeliveryOrderDtlEntity } from '../entity/delivery-order-detail.entity';
import { ContainerEntity } from '../entity/container.entity';
import { Package as PackageEntity } from '../entity/package.entity';
import { TariffEntity } from '../entity/tariff.entity';
import { DeliverOrder, OrderReqIn } from '../models/deliver-order.model';
import moment from 'moment';
import { DeliverOrderDetail } from '../models/delivery-order-detail.model';
import { User } from '../entity/user.entity';
import { genOrderNo } from '../utils/genKey';

export const orderRepository = mssqlConnection.getRepository(DeliverOrderEntity);
export const orderDtlRepository = mssqlConnection.getRepository(DeliveryOrderDtlEntity);
export const contRepository = mssqlConnection.getRepository(ContainerEntity);
export const packageRepository = mssqlConnection.getRepository(PackageEntity);
export const tariffRepository = mssqlConnection.getRepository(TariffEntity);

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
    .getMany();
  console.log('asd', contList.toString);
  return await contList;
};
// lấy dữ liệu của cont này ra. 1--check cont này đã làm lệnh chưa  2-- lấy dữ liệu ra
const checkContStatus = async (VOYAGEKEY: string, CNTRNO: string) => {
  const contArr = await contRepository
    .createQueryBuilder('cn')
    .leftJoin('DELIVER_ORDER', 'dto', 'cn.ROWGUID = dto.CONTAINER_ID and dto.JOB_CHK <> 1')
    .where('cn.VOYAGEKEY = :voyagekey', { voyagekey: VOYAGEKEY })
    .andWhere('cn.CNTRNO = :cont', { cont: CNTRNO })
    .getMany();
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
    }
  });
  return tariffInfo;
};

const saveInOrder = async (reqData: OrderReqIn[], createBy: User) => {
  const totalCbm = reqData.reduce((accumulator, item) => accumulator + item.CBM, 0);
  const orderNo = await genOrderNo('NK');

  let deliveryOrder: DeliverOrder = {
    DE_ORDER_NO: String(orderNo),
    CUSTOMER_CODE: reqData[0].CUSTOMER_CODE,
    CONTAINER_ID: reqData[0].CONTAINER_ID,
    INV_ID: reqData[0].INV_ID ? reqData[0].INV_ID : null,
    INV_DRAFT_ID: reqData[0].INV_DRAFT_ID ? reqData[0].INV_DRAFT_ID : null,
    ISSUE_DATE: new Date(),
    EXP_DATE: reqData[0].EXP_DATE,
    TOTAL_CBM: totalCbm,
    JOB_CHK: false,
    // INV_ID?: string;
    // INV_DRAFT_ID?: string;
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

  const order = orderRepository.create(deliveryOrder);
  const orderDtl = orderDtlRepository.create(deliveryOrderDtl);
  const neworder = await orderRepository.save(order);
  const neworderDtl = await orderDtlRepository.save(orderDtl);
  return {
    neworder,
    neworderDtl,
  };
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
};
