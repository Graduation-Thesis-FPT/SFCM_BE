import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import InvVatService from '../services/inv-vat.service';
import { whereRevenue } from '../repositories/inv-vat.repo';

class InvVatController {
  getReportRevenue = async (req: Request, res: Response) => {
    let rule: whereRevenue = {
      fromDate: new Date(),
      toDate: new Date(),
      isInEx: '',
      INV_NO: '',
      PAYER: '',
    };
    if (req.query.from && req.query.to) {
      const fromDate = new Date(req.query?.from as string);
      const toDate = new Date(req.query?.to as string);
      rule.fromDate = fromDate;
      rule.toDate = toDate;
    }
    if (req.query.isInEx) {
      rule.isInEx = String(req.query.isInEx) == 'I' ? 'I' : 'E';
    }
    if (req.query.INV_NO) {
      rule.INV_NO = String(req.query.INV_NO);
    }
    if (req.query.PAYER) {
      rule.PAYER = String(req.query.PAYER);
    }
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await InvVatService.getReportRevenue(rule),
    }).send(res);
  };
}
export default new InvVatController();
