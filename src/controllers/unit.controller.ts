import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import UnitService from '../services/unit.service';

class UnitController {
  createUnit = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const UnitList = res.locals.requestData;
    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_UNIT_SUCCESS,
      metadata: await UnitService.createAndUpdateUnit(UnitList, createBy),
    }).send(res);
  };

  deleteUnit = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_UNIT_SUCCESS,
      metadata: await UnitService.deleteUnit(req.body.UnitCodeList),
    }).send(res);
  };

  getUnit = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_UNIT_SUCCESS,
      metadata: await UnitService.getAllUnit(),
    }).send(res);
  };
}

export default new UnitController();
