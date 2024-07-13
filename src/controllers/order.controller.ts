import { Request, Response } from 'express';
import { OK } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import OrderService from '../services/order.service';
class orderController {
  getContList = async (req: Request, res: Response) => {
    const VOYAGEKEY = req.query.VOYAGEKEY as string;
    const BILLOFLADING = req.query.BILLOFLADING as string;

    console.log('asd', VOYAGEKEY, BILLOFLADING);
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getContList(VOYAGEKEY, BILLOFLADING),
    }).send(res);
  };

  getManifestPackage = async (req: Request, res: Response) => {
    const VOYAGEKEY = req.query.VOYAGEKEY as string;
    const CNTRNO = req.query.CNTRNO as string;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getManifestPackage(VOYAGEKEY, CNTRNO),
    }).send(res);
  };

  getToBillIn = async (req: Request, res: Response) => {
    const { arrayPackage, addInfo } = req.body;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getToBillIn(arrayPackage, addInfo),
    }).send(res);
  };

  saveInOrder = async (req: Request, res: Response) => {
    const { arrayPackage } = req.body;
    const createBy = res.locals.user;
    new OK({
      message: SUCCESS_MESSAGE.SAVE_ORDER_SUCCESS,
      metadata: await OrderService.saveInOrder(arrayPackage, createBy),
    }).send(res);
  };
}

export default new orderController();
