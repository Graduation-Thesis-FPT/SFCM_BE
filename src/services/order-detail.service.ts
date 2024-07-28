import { DeliveryOrderDtlEntity } from '../entity/delivery-order-detail.entity';
import { findOrderDetailsByOrderNo } from '../repositories/order-detail.repo';

class OrderDetailService {
  static findOrderDetailsByOrderNo = async (orderNo: string): Promise<DeliveryOrderDtlEntity[]> => {
    return await findOrderDetailsByOrderNo(orderNo);
  };
}

export default OrderDetailService;
