import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import BlockService from '../services/block.service';
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

  deleteBlock = async (req: Request, res: Response) => {
    const { ROWGUID_LIST } = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_BLOCK_SUCCESS,
      metadata: await BlockService.deleteBlock(ROWGUID_LIST),
    }).send(res);
  };

  getBlock = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_BLOCK_SUCCESS,
      metadata: await BlockService.getAllBlock(),
    }).send(res);
  };
}

export default new GateController();
