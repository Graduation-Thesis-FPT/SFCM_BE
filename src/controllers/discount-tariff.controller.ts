import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import DiscountTariffService from '../services/discount-tariff.service';

class DisCountTariffController {
  createAndUpdateDiscountTariff = async (req: Request, res: Response) => {
    const createBy = res.locals.user;
    const tariffList = res.locals.requestData;
    new CREATED({
      message: SUCCESS_MESSAGE.SAVE_TARIFF_DISCOUNT_SUCCESS,
      metadata: await DiscountTariffService.createAndUpdateDiscountTariff(tariffList, createBy),
    }).send(res);
  };

  deleteDiscountTariff = async (req: Request, res: Response) => {
    new SuccessResponse({
      message: SUCCESS_MESSAGE.DELETE_TARIFF_DISCOUNT_SUCCESS,
      metadata: await DiscountTariffService.deleteDiscountTariff(req.body.discountTariffCodeList),
    }).send(res);
  };

  getDiscountTariff = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_TARIFF_DISCOUNT_SUCCESS,
      metadata: await DiscountTariffService.getAllDiscountTariff(),
    }).send(res);
  };

  getDiscountTariffByTemplate = async (req: Request, res: Response) => {
    const template = req.query.template as string;
    console.log(template);
    new OK({
      message: SUCCESS_MESSAGE.GET_TARIFF_DISCOUNT_SUCCESS,
      metadata: await DiscountTariffService.getDiscountTariffByTemplate(template),
    }).send(res);
  };
}

export default new DisCountTariffController();
