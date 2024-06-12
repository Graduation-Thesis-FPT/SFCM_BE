import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import CustomerTypeService from '../services/customerType.service';

class CustomerTypeController {
  createAndUpdateCustomerType = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const customerTypeList = res.locals.requestData;
    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_CUSTOMERTYPE_SUCCESS,
      metadata: await CustomerTypeService.createAndUpdateCustomerType(customerTypeList, createBy),
    }).send(res);
  };

  deleteCustomerType = async (req: Request, res: Response) => {
    const { CUSTOMERTYPE_CODE_LIST } = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_CUSTOMERTYPE_SUCCESS,
      metadata: await CustomerTypeService.deleteCustomerType(CUSTOMERTYPE_CODE_LIST),
    }).send(res);
  };

  getCustomerType = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_CUSTOMERTYPE_SUCCESS,
      metadata: await CustomerTypeService.getAllCustomerType(),
    }).send(res);
  };
}

export default new CustomerTypeController();
