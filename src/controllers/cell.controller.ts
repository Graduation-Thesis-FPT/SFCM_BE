import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import BlockService from '../services/block.service';

class CellController {
  createAndUpdateCell = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const blockList = res.locals.requestData;

    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_CELL_SUCCESS,
      metadata: await BlockService.createAndUpdateCell(blockList, createBy),
    }).send(res);
  };

  deleteCell = async (req: Request, res: Response) => {
    const { ROWGUID_LIST } = req.body;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_BLOCK_SUCCESS,
      metadata: await BlockService.deleteCell(ROWGUID_LIST),
    }).send(res);
  };

  getAllCell = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_BLOCK_SUCCESS,
      metadata: await BlockService.getAllCell(),
    }).send(res);
  };
}

export default new CellController();
