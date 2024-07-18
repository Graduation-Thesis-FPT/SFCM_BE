import { Request, Response } from 'express';
import { SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import CellService from '../services/cell.service';

class CellController {
  suggestCell = async (req: Request, res: Response) => {
    const warehouseCode = req.query.warehouseCode as string;
    const palletInfo = {
      PALLET_HEIGHT: Number(req.query.PALLET_HEIGHT as string),
      PALLET_LENGTH: Number(req.query.PALLET_LENGTH as string),
      PALLET_WIDTH: Number(req.query.PALLET_WIDTH as string),
    };
    console.log('🚀 ~ CellController ~ suggestCell= ~ palletInfo:', palletInfo);
    new SuccessResponse({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await CellService.suggestCell(palletInfo, warehouseCode),
    }).send(res);
  };
}

export default new CellController();
