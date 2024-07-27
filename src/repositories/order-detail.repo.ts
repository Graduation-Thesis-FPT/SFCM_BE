import mssqlConnection from '../db/mssql.connect';
import { DeliveryOrderDtlEntity } from '../entity/delivery-order-detail.entity';

const orderDtlRepository = mssqlConnection.getRepository(DeliveryOrderDtlEntity);

const findOrderDetailsByOrderNo = async (orderNo: string): Promise<DeliveryOrderDtlEntity[]> => {
  return orderDtlRepository.find({
    where: { DE_ORDER_NO: orderNo },
  });
};

export { findOrderDetailsByOrderNo };
