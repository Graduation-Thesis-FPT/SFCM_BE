import { Request, Response } from 'express';
import { SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import CellService from '../services/cell.service';

class CellController {
  suggestCell = async (req: Request, res: Response) => {
    const warehouseCode = req.query.warehouseCode as string;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await CellService.suggestCell(req.body, warehouseCode),
    }).send(res);
  };
}

export default new CellController();
