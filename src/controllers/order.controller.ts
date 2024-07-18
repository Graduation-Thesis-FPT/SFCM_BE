import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import OrderService from '../services/order.service';
import InvoiceManagementMisa from '../services/InvoiceMisa.service';
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
    const { VOYAGEKEY, CNTRNO } = req.query;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getManifestPackage(String(VOYAGEKEY), String(CNTRNO)),
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
    const { arrayPackage, paymentInfoHeader, paymentInfoDtl } = req.body;
    const createBy = res.locals.user;
    new OK({
      message: SUCCESS_MESSAGE.SAVE_ORDER_SUCCESS,
      metadata: await OrderService.saveInOrder(
        arrayPackage,
        paymentInfoHeader,
        paymentInfoDtl,
        createBy,
      ),
    }).send(res);
  };

  //Phát hành hóa đơn
  invoicePublish = async (req: Request, res: Response) => {
    let temp = new InvoiceManagementMisa();
    let data = await temp.publish(req);
    new OK({
      message: SUCCESS_MESSAGE.PUBLISH_INVOICE_SUCCESS,
      metadata: data,
    }).send(res);
  };
  //In hóa đơn
  viewInvoice = async (req: Request, res: Response) => {
    let temp = new InvoiceManagementMisa();
    let data = await temp.getInvView(req);
    new OK({
      message: SUCCESS_MESSAGE.SUCCESS,
      metadata: data,
    }).send(res);
  };
}

export default new orderController();
