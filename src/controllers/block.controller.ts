import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import BlockService from '../services/block.service';

class BlockController {
  createBlock = async (req: Request, res: Response) => {
    const createBy = res.locals.user;

    new CREATED({
      message: SUCCESS_MESSAGE.LOGIN_SUCCESS,
      metadata: await BlockService.createBlock(req.body, createBy),
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

export default new BlockController();
