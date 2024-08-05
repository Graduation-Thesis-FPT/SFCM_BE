import { Request, Response } from 'express';
import { SUCCESS_MESSAGE } from '../constants';
import { OK } from '../core/success.response';
import CustomerOrderService from '../services/customer-order.service';
import { DateRange } from '../models/deliver-order.model';

class CustomerOrderController {
  getOrdersByCustomerId = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const filterDate = req.query as object as DateRange;
    new OK({
      message: SUCCESS_MESSAGE.GET_CUSTOMER_ORDERS_SUCCESS,
      metadata: await CustomerOrderService.getOrdersByCustomerCode(user, filterDate),
    }).send(res);
  };

  getImportedOrders = async (req: Request, res: Response) => {
    const status = req.query.status as string;
    const user = res.locals.user;
    const filterDate = req.query as object as DateRange;
    new OK({
      message: SUCCESS_MESSAGE.GET_IMPORTED_ORDERS_SUCCESS,
      metadata: await CustomerOrderService.getImportedOrdersByStatus(status, user, filterDate),
    }).send(res);
  };

  getExportedOrders = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const status = req.query.status as string;
    const filterDate = req.query as object as DateRange;
    new OK({
      message: SUCCESS_MESSAGE.GET_EXPORTED_ORDERS_SUCCESS,
      metadata: await CustomerOrderService.getExportedOrdersByStatus(status, user, filterDate),
    }).send(res);
  };

  getOrderByOrderNo = async (req: Request, res: Response) => {
    const orderNo = req.params.orderNo;
    new OK({
      message: SUCCESS_MESSAGE.GET_ORDER_SUCCESS,
      metadata: await CustomerOrderService.getOrderByOrderNo(orderNo),
    }).send(res);
  };
}

export default new CustomerOrderController();
