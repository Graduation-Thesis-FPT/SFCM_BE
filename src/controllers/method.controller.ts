import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import MethodService from '../services/method.service';

class methodController {
  createAndUpdateMethod = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const methodList = res.locals.requestData;

    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_METHOD_SUCCESS,
      metadata: await MethodService.createAndUpdateMethod(methodList, createBy),
    }).send(res);
  };

  deleteMethod = async (req: Request, res: Response) => {
    const { METHOD_CODE } = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_METHOD_SUCCESS,
      metadata: await MethodService.deleteMethod(METHOD_CODE),
    }).send(res);
  };

  getAllMethod = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_METHOD_SUCCESS,
      metadata: await MethodService.getAllMethod(),
    }).send(res);
  };
}

export default new methodController();
