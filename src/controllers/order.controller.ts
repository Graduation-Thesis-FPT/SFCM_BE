import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import OrderService from '../services/order.service';
import InvoiceManagementMisa from '../services/InvoiceMisa.service';
import { whereExManifest } from '../models/deliver-order.model';
import { ReportInEx } from '../repositories/order.repo';
class orderController {
  getContList = async (req: Request, res: Response) => {
    const VOYAGEKEY = req.query.VOYAGEKEY as string;
    const BILLOFLADING = req.query.BILLOFLADING as string;

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
    const { arrayPackage, services, addInfo } = req.body;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getToBillIn(arrayPackage, services, addInfo),
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

  getExManifest = async (req: Request, res: Response) => {
    const { VOYAGEKEY, CONTAINER_ID, HOUSE_BILL } = req.query;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getExManifest({
        CONTAINER_ID: String(CONTAINER_ID),
        HOUSE_BILL: String(HOUSE_BILL),
        VOYAGEKEY: String(VOYAGEKEY),
      }),
    }).send(res);
  };

  getToBillEx = async (req: Request, res: Response) => {
    const { arrayPackage, addInfo } = req.body;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getToBillEx(arrayPackage),
    }).send(res);
  };

  getOrderContList = async (req: Request, res: Response) => {
    const { VOYAGEKEY } = req.query;
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getOrderContList(String(VOYAGEKEY)),
    }).send(res);
  };

  saveExOrder = async (req: Request, res: Response) => {
    const { arrayPackage, paymentInfoHeader, paymentInfoDtl } = req.body;
    const createBy = res.locals.user;
    new OK({
      message: SUCCESS_MESSAGE.SAVE_ORDER_SUCCESS,
      metadata: await OrderService.saveExOrder(
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
    let data = await temp.publish(req, 'NK');
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

  //phát hành hóa đơn xuất
  invoicePublishEx = async (req: Request, res: Response) => {
    let temp = new InvoiceManagementMisa();
    let data = await temp.publish(req, 'XK');
    new OK({
      message: SUCCESS_MESSAGE.PUBLISH_INVOICE_SUCCESS,
      metadata: data,
    }).send(res);
  };

  getReportInExOrder = async (req: Request, res: Response) => {
    let rule: ReportInEx = {
      fromDate: new Date(),
      toDate: new Date(),
      isInEx: '',
      CUSTOMER_CODE: '',
      CNTRNO: '',
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
    if (req.query.CUSTOMER_CODE) {
      rule.CUSTOMER_CODE = String(req.query.CUSTOMER_CODE);
    }
    if (req.query.CNTRNO) {
      rule.CNTRNO = String(req.query.CNTRNO);
    }
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await OrderService.getReportInExOrder(rule),
    }).send(res);
  };
}

export default new orderController();
