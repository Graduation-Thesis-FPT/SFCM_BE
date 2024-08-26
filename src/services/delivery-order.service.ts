import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { OrderReqIn, whereExManifest } from '../models/deliver-order.model';
import {
  getContList,
  checkContStatus,
  getManifestPackage,
  getTariffSTD,
  saveInOrder,
  getExManifest,
  saveExOrder,
  getOrderContList,
  getTariffDis,
  getServicesTariff,
  checkPackageStatusOrder,
  checkPalletOfHouseBill,
  getReportInExOrder,
  ReportInEx,
  getCancelInvoice,
  CancelInvoiceWhere,
} from '../repositories/delivery-order.repo';
import { checkContSize, roundMoney } from '../utils';
import { Tariff } from '../models/tariff.model';
import { Package } from '../models/packageMnfLd.model';
import { Payment } from '../models/inv_vat.model';
import { PaymentDtl } from '../models/inv_vat_dtl.model';
import moment from 'moment';
class DeliveryOrderService {
  static getContList = async (VOYAGEKEY: string, BILLOFLADING: string) => {
    if (!VOYAGEKEY || !BILLOFLADING) {
      throw new BadRequestError(`Mã tàu ${VOYAGEKEY} hoặc số vận đơn không được rỗng!`);
    }
    return await getContList(VOYAGEKEY, BILLOFLADING);
  };

  static getManifestPackage = async (VOYAGEKEY: string, CNTRNO: string) => {
    if (!VOYAGEKEY || !CNTRNO) {
      throw new BadRequestError(`Mã tàu hoặc số Container không được rỗng!`);
    }
    const checkStatus = await checkContStatus(VOYAGEKEY, CNTRNO);
    if (!checkStatus) {
      throw new BadRequestError(`Số container ${CNTRNO} đã làm lệnh!`);
    }

    return await getManifestPackage(VOYAGEKEY, CNTRNO);
  };

  static getToBillIn = async (dataReq: Package[], services: string[], addInfo: any) => {
    const billInfo = [];
    //Tính tiền nhập kho-begin
    if (!dataReq.length) {
      throw new BadRequestError(`Không có dữ liệu tính cước!`);
    }
    if (!dataReq[0].CUSTOMER_CODE) {
      throw new BadRequestError(`Vui lòng chọn đối tượng thanh toán!`);
    }
    addInfo = {
      ITEM_TYPE_CODE_CNTR: dataReq[0].ITEM_TYPE_CODE_CNTR,
      PAYER: dataReq[0].CUSTOMER_CODE,
      METHOD_CODE: 'NK',
    };

    let datas = dataReq.map((item, idx) => ({
      HOUSE_BILL: item.HOUSE_BILL,
      LOT_NO: idx + 1,
      ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
      UNIT_CODE: item.PACKAGE_UNIT_CODE,
      CARGO_PIECE: item.CARGO_PIECE,
      CBM: item.CBM,
      DECLARE_NO: item.DECLARE_NO,
      NOTE: item.NOTE,
      REF_CONTAINER: item.CONTAINER_ID,
    }));

    const totalCbm = datas.reduce((accumulator, item) => accumulator + item.CBM, 0);
    let whereObj = {
      METHOD_CODE: addInfo.METHOD_CODE,
      ITEM_TYPE_CODE: addInfo.ITEM_TYPE_CODE_CNTR,
    };
    let tariffInfo: Tariff;
    tariffInfo = await getTariffDis({ ...whereObj, CUSTOMER_CODE: addInfo.PAYER });
    if (!tariffInfo) {
      tariffInfo = await getTariffSTD(whereObj);
    }
    if (!tariffInfo) {
      throw new BadRequestError(
        `Không tìm thấy biểu cước phù hợp! Vui lòng cấu hình tính cước lại Mã : ${whereObj['METHOD_CODE']} và loại hàng ${whereObj['ITEM_TYPE_CODE']}`,
      );
    }
    let quanlity: number = totalCbm;
    let vatPrice: number = tariffInfo.AMT_CBM * (tariffInfo.VAT / 100) * quanlity;
    let unitPrice: number = tariffInfo.AMT_CBM * (1 - tariffInfo.VAT / 100);
    let cost: number = tariffInfo.AMT_CBM * (1 - tariffInfo.VAT / 100) * quanlity;
    let totalPrice: number = vatPrice + cost;

    let tempObj: any = {
      UNIT_RATE: roundMoney(unitPrice),
      VAT_PRICE: roundMoney(vatPrice),
      AMOUNT: roundMoney(cost),
      TAMOUNT: roundMoney(totalPrice),
      QTY: (Math.round(quanlity * 100) / 100).toFixed(2),
    };
    billInfo.push(Object.assign(tempObj, tariffInfo));
    //Tính tiền nhập kho-end

    //Tính tiền dịch vụ đính kèm
    if (services.length) {
      for (let i = 0; i < services.length; i++) {
        const serviceTariffs = await getServicesTariff(
          services[i],
          addInfo.ITEM_TYPE_CODE_CNTR,
          addInfo.PAYER,
        );
        if (!serviceTariffs.length) {
          throw new BadRequestError(
            `Không tìm thấy cước của dịch vụ đính kèm! Vui lòng kiểm tra lại`,
          );
        }
        let serviceTariff = serviceTariffs[0];

        let quanlity: number = 1;
        let vatPrice: number = serviceTariff.AMT_CBM * (serviceTariff.VAT / 100) * quanlity;
        let unitPrice: number = serviceTariff.AMT_CBM * (1 - serviceTariff.VAT / 100);
        let cost: number = serviceTariff.AMT_CBM * (1 - serviceTariff.VAT / 100) * quanlity;
        let totalPrice: number = vatPrice + cost;

        let tempObj: any = {
          UNIT_RATE: roundMoney(unitPrice),
          VAT_PRICE: roundMoney(vatPrice),
          AMOUNT: roundMoney(cost),
          TAMOUNT: roundMoney(totalPrice),
          QTY: null,
        };
        billInfo.push(Object.assign(tempObj, serviceTariff));
      }
    }
    return billInfo;
  };

  static saveInOrder = async (
    req: OrderReqIn[],
    paymentInfo: Payment,
    paymentInfoDetail: PaymentDtl[],
    createBy: User,
  ) => {
    return await saveInOrder(req, paymentInfo, paymentInfoDetail, createBy);
  };

  static getExManifest = async (whereExManifest: whereExManifest) => {
    if (
      !whereExManifest.VOYAGEKEY ||
      !whereExManifest.HOUSE_BILL ||
      !whereExManifest.CONTAINER_ID
    ) {
      throw new BadRequestError(`Mã tàu hoặc số houseBill không được rỗng!`);
    }
    const checkStatus = await checkPackageStatusOrder(whereExManifest);
    if (!checkStatus) {
      throw new BadRequestError(`Số House Bill ${whereExManifest.HOUSE_BILL} đã làm lệnh!`);
    }
    const checkLifecycle = await checkPalletOfHouseBill(whereExManifest);
    if (!checkLifecycle) {
      throw new BadRequestError(
        `Bạn cần đưa các Pallet của số House Bill ${whereExManifest.HOUSE_BILL} vào kho để được làm lệnh!`,
      );
    }
    return await getExManifest(whereExManifest);
  };

  static getOrderContList = async (VOYAGEKEY: string) => {
    if (!VOYAGEKEY) {
      throw new BadRequestError(`Vui lòng chuyền số tàu chuyến!`);
    }
    return await getOrderContList(VOYAGEKEY);
  };

  static getToBillEx = async (dataReq: Package[], services: string[], addInfo: any) => {
    const arrReturn = [];
    addInfo = {
      METHOD_CODE: 'LK',
      ITEM_TYPE_CODE: dataReq[0].ITEM_TYPE_CODE,
      PAYER: dataReq[0].CUSTOMER_CODE,
    };

    //Tính tiền lưu kho-begin
    if (!dataReq.length) {
      throw new BadRequestError(`Không có dữ liệu tính cước!`);
    }
    if (!dataReq[0].CUSTOMER_CODE) {
      throw new BadRequestError(`Vui lòng chọn đối tượng thanh toán!`);
    }
    if (!dataReq[0].TIME_IN) {
      throw new BadRequestError(
        `Không tìm thấy thời gian nhập kho của HouseBill : ${dataReq[0].HOUSE_BILL}!`,
      );
    }
    if (!dataReq[0].EXP_DATE) {
      throw new BadRequestError(
        `Không tìm thấy thời gian hạn lệnh của HouseBill : ${dataReq[0].HOUSE_BILL}!`,
      );
    }
    let tempEXP_DATE = moment(dataReq[0].EXP_DATE, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    let tempTINE_IN = moment(dataReq[0].TIME_IN, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('day');
    let numberOfStorageDays: number = tempEXP_DATE.diff(tempTINE_IN, 'days') + 1;

    let whereStorageTarif = {
      METHOD_CODE: addInfo.METHOD_CODE,
      ITEM_TYPE_CODE: addInfo.ITEM_TYPE_CODE,
    };
    let tariffInfo: Tariff;
    tariffInfo = await getTariffDis({ ...whereStorageTarif, CUSTOMER_CODE: addInfo.PAYER });
    if (!tariffInfo) {
      tariffInfo = await getTariffSTD(whereStorageTarif);
    }
    if (!tariffInfo) {
      throw new BadRequestError(
        `Không tìm thấy biểu cước phù hợp! Vui lòng cấu hình tính cước lại Mã : ${whereStorageTarif['METHOD_CODE']} và loại hàng ${whereStorageTarif['ITEM_TYPE_CODE']}`,
      );
    }
    let quanlity: number = numberOfStorageDays;
    let vatPrice: number = tariffInfo.AMT_CBM * (tariffInfo.VAT / 100) * quanlity;
    let unitPrice: number = tariffInfo.AMT_CBM * (1 - tariffInfo.VAT / 100);
    let cost: number = tariffInfo.AMT_CBM * (1 - tariffInfo.VAT / 100) * quanlity;
    let totalPrice: number = vatPrice + cost;

    let tempObj: any = {
      UNIT_RATE: roundMoney(unitPrice),
      VAT_PRICE: roundMoney(vatPrice),
      AMOUNT: roundMoney(cost),
      TAMOUNT: roundMoney(totalPrice),
      QTY: (Math.round(quanlity * 100) / 100).toFixed(2),
    };
    arrReturn.push(Object.assign(tempObj, tariffInfo));
    //Tính tiền lưu kho-End
    //Tính tiền chênh lệch-begin

    //Tính tiền chênh lệch-end

    //Tính tiền dịch vụ đính kèm
    if (services.length) {
      console.log(addInfo);
      for (let i = 0; i < services.length; i++) {
        const serviceTariffs = await getServicesTariff(
          services[i],
          addInfo.ITEM_TYPE_CODE,
          addInfo.PAYER,
        );
        if (!serviceTariffs.length) {
          throw new BadRequestError(
            `Không tìm thấy cước của dịch vụ đính kèm! Vui lòng kiểm tra lại`,
          );
        }
        let serviceTariff = serviceTariffs[0];

        let quanlity: number = 1;
        let vatPrice: number = serviceTariff.AMT_CBM * (serviceTariff.VAT / 100) * quanlity;
        let unitPrice: number = serviceTariff.AMT_CBM * (1 - serviceTariff.VAT / 100);
        let cost: number = serviceTariff.AMT_CBM * (1 - serviceTariff.VAT / 100) * quanlity;
        let totalPrice: number = vatPrice + cost;

        let tempObj: any = {
          UNIT_RATE: roundMoney(unitPrice),
          VAT_PRICE: roundMoney(vatPrice),
          AMOUNT: roundMoney(cost),
          TAMOUNT: roundMoney(totalPrice),
          QTY: null,
        };
        arrReturn.push(Object.assign(tempObj, serviceTariff));
      }
    }
    return arrReturn;
  };

  static saveExOrder = async (
    req: OrderReqIn[],
    paymentInfo: Payment,
    paymentInfoDetail: PaymentDtl[],
    createBy: User,
  ) => {
    return await saveExOrder(req, paymentInfo, paymentInfoDetail, createBy);
  };

  static getReportInExOrder = async (whereObj: ReportInEx) => {
    if (!whereObj.fromDate || !whereObj.toDate) {
      throw new BadRequestError(`Vui lòng chọn từ ngày đến ngày!`);
    }
    return await getReportInExOrder(whereObj);
  };

  static getCancelInvoice = async (whereObj: CancelInvoiceWhere) => {
    if (!whereObj.from || !whereObj.to) {
      throw new BadRequestError(`Vui lòng chọn từ ngày đến ngày!`);
    }
    return await getCancelInvoice(whereObj);
  };
}

export default DeliveryOrderService;
