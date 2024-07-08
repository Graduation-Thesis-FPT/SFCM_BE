import { Request, Response } from 'express';
import { OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import PalletService from '../services/pallet.service';

class palletController {
  updatePallet = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const data = req.body;

    new SuccessResponse({
      message: SUCCESS_MESSAGE.UPDATE_PALLET_SUCCESS,
      metadata: await PalletService.updatePallet(data, createBy),
    }).send(res);
  };

  changePalletPosition = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const data = req.body;

    new SuccessResponse({
      message: SUCCESS_MESSAGE.UPDATE_PALLET_SUCCESS,
      metadata: await PalletService.changePalletPosition(data, createBy),
    }).send(res);
  };

  getAllPalletPosition = async (req: Request, res: Response) => {
    const warehouseCode = req.query.warehouseCode as string;
    new OK({
      message: SUCCESS_MESSAGE.GET_PALLET_SUCCESS,
      metadata: await PalletService.getPalletPosition(warehouseCode),
    }).send(res);
  };

  getPalletByStatus = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: SUCCESS_MESSAGE.GET_PALLET_SUCCESS,
      metadata: await PalletService.getPalletByStatus(),
    }).send(res);
  };
}

export default new palletController();
