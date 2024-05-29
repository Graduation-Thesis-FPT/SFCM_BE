import { Request, Response } from 'express';
import { CREATED } from '../core/success.response';
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
}

export default new BlockController();
