import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import TariffService from '../services/tariff.service';

class TariffController {
  createAndUpdateTariff = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const tariffList = res.locals.requestData;
    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_TARIFF_SUCCESS,
      metadata: await TariffService.createAndUpdateTariff(tariffList, createBy),
    }).send(res);
  };

  deleteTariff = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_TARIFF_SUCCESS,
      metadata: await TariffService.deleteTariff(req.body.tariffCodeList),
    }).send(res);
  };

  getTariff = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_TARIFF_SUCCESS,
      metadata: await TariffService.getAllTariff(),
    }).send(res);
  };

  getAllTariffTemplate = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_TARIFF_SUCCESS,
      metadata: await TariffService.getTariffTemplate(),
    }).send(res);
  };

  getTariffByTemplate = async (req: Request, res: Response) => {
    const template = req.query.template as string;
    new OK({
      message: SUCCESS_MESSAGE.GET_TARIFF_SUCCESS,
      metadata: await TariffService.getTariffByTemplate(template),
    }).send(res);
  };
}

export default new TariffController();
