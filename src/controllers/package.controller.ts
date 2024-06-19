import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import PackageService from '../services/package.service';

class packageController {
  createAndUpdatepackage = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const reqData = res.locals.requestData;

    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_PACKAGE_SUCCESS,
      metadata: await PackageService.createAndUpdate(reqData, createBy),
    }).send(res);
  };

  deletepackage = async (req: Request, res: Response) => {
    const {packageRow} = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_PACKAGE_SUCCESS,
      metadata: await PackageService.deletePackage(packageRow),
    }).send(res);
  };

  getpackage = async (req: Request, res: Response) => {
   const refcont = req.query.REF_CONTAINER as string;
    new OK({
      message: SUCCESS_MESSAGE.GET_PACKAGE_SUCCESS,
      metadata: await PackageService.getPackage(refcont),
    }).send(res);
  };
}

export default new packageController();
