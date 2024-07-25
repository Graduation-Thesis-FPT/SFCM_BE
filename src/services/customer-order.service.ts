import { ERROR_MESSAGE } from '../constants';
import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { DeliverOrder } from '../models/deliver-order.model';
import { findCustomerByUserId } from '../repositories/customer.repo';
import { findOrdersByCustomerCode } from '../repositories/order.repo';

class CustomerOrderService {
  static getOrdersByCustomerCode = async (user: User): Promise<DeliverOrder[]> => {
    const customer = await findCustomerByUserId(user.ROWGUID);

    if (!customer) {
      throw new BadRequestError(ERROR_MESSAGE.CUSTOMER_NOT_EXIST);
    }

    const customerCode = customer.CUSTOMER_CODE;
    const orders = await findOrdersByCustomerCode(customerCode);

    if (orders.length) {
      return orders;
    }

    return [];
  };
}

export default CustomerOrderService;
