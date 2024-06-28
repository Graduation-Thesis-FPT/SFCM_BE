import mssqlConnection from '../db/mssql.connect';
import { OrderEntity } from '../entity/order.entity';
import { ContainerEntity } from '../entity/container.entity';
import { Package as PackageEntity } from '../entity/package.entity';
import { Order } from '../models/order.model';

export const orderRepository = mssqlConnection.getRepository(OrderEntity);
export const contRepository = mssqlConnection.getRepository(ContainerEntity);
export const packageRepository = mssqlConnection.getRepository(PackageEntity);

const createfakeOrderData = async (data: Order[]) => {
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
    .select('MAX(CAST(RIGHT(order.ORDER_NO, 4) AS INT))', 'lastThreeDigits')
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
  const contList =  contRepository
    .createQueryBuilder('cn')
    .leftJoin('DT_ORDER', 'dto', 'cn.ROWGUID = dto.REF_CONTAINER and dto.GATE_CHK <> 1')
    .where('cn.VOYAGEKEY = :voyagekey', { voyagekey: VOYAGEKEY })
    .andWhere('cn.BILLOFLADING = :bill', { bill: BILLOFLADING })
    .getMany();
    console.log('asd', contList.toString)
  return await contList;
};
// lấy dữ liệu của cont này ra. 1--check cont này đã làm lệnh chưa  2-- lấy dữ liệu ra
const checkContStatus = async (VOYAGEKEY: string, CNTRNO: string) => {
  const contArr = await contRepository
    .createQueryBuilder('cn')
    .leftJoin('DT_ORDER', 'dto', 'cn.ROWGUID = dto.REF_CONTAINER and dto.GATE_CHK <> 1')
    .where('cn.VOYAGEKEY = :voyagekey', { voyagekey: VOYAGEKEY })
    .andWhere('cn.CNTRNO = :cont', { cont: CNTRNO })
    .getMany();
  if (contArr.length) return false;
  return true;
};
const getManifestPackage = async (VOYAGEKEY: string, CNTRNO: string) => {
  const listMnf = await packageRepository
    .createQueryBuilder('pk')
    .leftJoin('DT_CNTR_MNF_LD', 'cn', 'pk.REF_CONTAINER = cn.ROWGUID')
    .where('cn.VOYAGEKEY = :voyagekey', { voyagekey: VOYAGEKEY })
    .andWhere('cn.CNTRNO = :cont', { cont: CNTRNO })
    .select(['pk', 'cn.CNTRSZTP'])
    .addSelect('cn.ITEM_TYPE_CODE', 'ITEM_TYPE_CODE_CNTR')
    .getMany();
  return listMnf;
};

export {
  createfakeOrderData,
  findOrder,
  findMaxOrderNo,
  findMaxDraftNo,
  getContList,
  checkContStatus,
  getManifestPackage,
};
