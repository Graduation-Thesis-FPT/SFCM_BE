import { Request, Response } from 'express';
import { SUCCESS_MESSAGE } from '../constants';
import { SuccessResponse } from '../core/success.response';
import CustomerOrderService from '../services/customer-order.service';

class CustomerOrderController {
  getOrdersByCustomerId = async (req: Request, res: Response) => {
    const user = res.locals.user;
    new SuccessResponse({
        message: SUCCESS_MESSAGE.GET_CUSTOMER_ORDERS_SUCCESS,
        metadata: await CustomerOrderService.getOrdersByCustomerCode(user),
      }).send(res);
  };
}

export default new CustomerOrderController();
