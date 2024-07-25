import { Request, Response } from 'express';
import { OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import PalletService from '../services/pallet.service';

class palletController {
  placePalletIntoCell = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const data = req.body;

    new SuccessResponse({
      message: SUCCESS_MESSAGE.UPDATE_PALLET_SUCCESS,
      metadata: await PalletService.placePalletIntoCell(data, createBy),
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

  getListJobImport = async (req: Request, res: Response) => {
    const palletStatus = req.query.palletStatus as string;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.GET_PALLET_SUCCESS,
      metadata: await PalletService.getListJobImport(palletStatus),
    }).send(res);
  };

  getListJobExport = async (req: Request, res: Response) => {
    const warehouseCode = req.query.warehouseCode as string;
    new SuccessResponse({
      message: SUCCESS_MESSAGE.GET_PALLET_SUCCESS,
      metadata: await PalletService.getListJobExport(warehouseCode),
    }).send(res);
  };

  exportPallet = async (req: Request, res: Response) => {
    const data = req.body;
    const createBy = res.locals.user;

    new SuccessResponse({
      message: SUCCESS_MESSAGE.UPDATE_PALLET_SUCCESS,
      metadata: await PalletService.exportPallet(data, createBy),
    }).send(res);
  };
}

export default new palletController();
