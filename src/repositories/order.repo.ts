import mssqlConnection from '../db/mssql.connect';
import { OrderEntity } from '../entity/order.entity';
import { Order } from '../models/order.model';

export const orderRepository = mssqlConnection.getRepository(OrderEntity);

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

export { createfakeOrderData, findOrder, findMaxOrderNo, findMaxDraftNo };
