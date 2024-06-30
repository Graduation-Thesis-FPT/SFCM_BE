import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import TariffTempService from '../services/tariff-temp.service';

class TariffTempCodeController {
  createTariffTemp = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const tariffTemp = res.locals.requestData;
    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_TARIFFCODE_SUCCESS,
      metadata: await TariffTempService.createTariffTemplate(tariffTemp, createBy),
    }).send(res);
  };

  deleteTariffTemp = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_TARIFFCODE_SUCCESS,
      metadata: await TariffTempService.deleteTariffTemp(req.body.tariffTempCode),
    }).send(res);
  };

  getAllTariffTemplate = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_TARIFF_SUCCESS,
      metadata: await TariffTempService.getTariffTemplate(),
    }).send(res);
  };
}

export default new TariffTempCodeController();
