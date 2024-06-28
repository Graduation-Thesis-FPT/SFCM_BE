import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import OrderService from '../services/order.service';
class orderController {
  getContList = async (req: Request, res: Response) => {
    const VOYAGEKEY = req.query.VOYAGEKEY as string;
    const BILLOFLADING = req.query.BILLOFLADING as string;

    console.log('asd', VOYAGEKEY, BILLOFLADING)
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getContList(VOYAGEKEY, BILLOFLADING),
    }).send(res);
  };

  getManifestPackage = async (req: Request, res: Response) => {
    const { VOYAGEKEY, CNTRNO } = req.query;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getManifestPackage(String(VOYAGEKEY), String(CNTRNO)),
    }).send(res);
  };
}

export default new orderController();
