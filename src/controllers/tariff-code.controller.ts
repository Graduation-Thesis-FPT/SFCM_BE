import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import TariffCodeService from '../services/tariff-code.service';

class TariffCodeController {
  createTariffCode = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const tariffCodeList = res.locals.requestData;
    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_TARIFFCODE_SUCCESS,
      metadata: await TariffCodeService.createAndUpdateTariffCode(tariffCodeList, createBy),
    }).send(res);
  };

  deleteTariffCode = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_TARIFFCODE_SUCCESS,
      metadata: await TariffCodeService.deleteTariffCode(req.body.tariffCodeList),
    }).send(res);
  };

  getTariffCode = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_TARIFFCODE_SUCCESS,
      metadata: await TariffCodeService.getAllTariffCode(),
    }).send(res);
  };
}

export default new TariffCodeController();
