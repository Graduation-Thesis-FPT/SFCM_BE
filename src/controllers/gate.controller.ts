import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import GateService from '../services/gate.service';

class GateController {
  createAndUpdateGate = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const gateList = res.locals.requestData;

    new CREATED({
      message: SUCCESS_MESSAGE.CREATE_GATE_SUCCESS,
      metadata: await GateService.createAndUpdateGate(gateList, createBy),
    }).send(res);
  };

  deleteGate = async (req: Request, res: Response) => {
    const { GATE_CODE_LIST } = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_GATE_SUCCESS,
      metadata: await GateService.deleteGate(GATE_CODE_LIST),
    }).send(res);
  };

  getAllGate = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_GATE_SUCCESS,
      metadata: await GateService.getAllGate(),
    }).send(res);
  };
}

export default new GateController();
