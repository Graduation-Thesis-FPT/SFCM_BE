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
} from '../repositories/order.repo';
import { checkContSize, roundMoney } from '../utils';
import { Tariff } from '../models/tariff.model';
import { Package } from '../models/packageMnfLd.model';
import { Payment } from '../models/inv_vat.model';
import { PaymentDtl } from '../models/inv_vat_dtl.model';
class OrderService {
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
      throw new BadRequestError(`Số cont ${CNTRNO} đã làm lệnh!`);
    }

    return await getManifestPackage(VOYAGEKEY, CNTRNO);
  };

  static getToBillIn = async (dataReq: Package[], services: string[], addInfo: any) => {
    const arrReturn = [];
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
    arrReturn.push(Object.assign(tempObj, tariffInfo));
    //Tính tiền nhập kho-end

    //Tính tiền dịch vụ đính kèm
    if (services.length) {
      const serviceTariffs = await getServicesTariff(services, addInfo.ITEM_TYPE_CODE_CNTR);
      if (serviceTariffs.length != services.length) {
        throw new BadRequestError(
          `Không tìm thấy cước chuẩn của dịch vụ đính kèm! Vui lòng kiểm tra lại`,
        );
      }
      for (let i = 0; i < serviceTariffs.length; i++) {
        let serviceTariff = serviceTariffs[i];

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
          QTY: (Math.round(quanlity * 100) / 100).toFixed(2),
        };
        arrReturn.push(Object.assign(tempObj, serviceTariff));
      }
    }
    return arrReturn;
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
    return await getExManifest(whereExManifest);
  };

  static getOrderContList = async (VOYAGEKEY: string) => {
    if (!VOYAGEKEY) {
      throw new BadRequestError(`Vui lòng chuyền số tàu chuyến!`);
    }
    return await getOrderContList(VOYAGEKEY);
  };

  static getToBillEx = async (dataReq_sualai: Package[]) => {
    const arrReturn = [];
    const addInfo = {
      ITEM_TYPE_CODE_CNTR: 'GP',
      METHOD_CODE: 'XK',
    };
    const dataReq = [
      {
        HOUSE_BILL: 'HB01',
        LOT_NO: '1',
        ITEM_TYPE_CODE: 'GP',
        UNIT_CODE: 'MTK',
        CARGO_PIECE: 12,
        CBM: 12,
        DECLARE_NO: '12',
        NOTE: '112',
        REF_CONTAINER: 'B4225CEC-EFEE-4A63-9151-25E2241ECD85',
      },
      {
        HOUSE_BILL: 'HB01',
        LOT_NO: '2',
        ITEM_TYPE_CODE: 'GP',
        UNIT_CODE: 'MTK',
        CARGO_PIECE: 13,
        CBM: 14,
        DECLARE_NO: '14',
        NOTE: '14',
        REF_CONTAINER: 'B4225CEC-EFEE-4A63-9151-25E2241ECD85',
      },
    ];
    if (!dataReq.length || !Object.keys(addInfo).length) {
      throw new BadRequestError(`Không có dữ liệu tính cước!`);
    }
    const totalCbm = dataReq.reduce((accumulator, item) => accumulator + item.CBM, 0);
    //kiểm tra xem có biểu cước ở bảng cấu hình giảm giá không- Nếu kh có thì tìm giá trị ở biểu cước chuẩn
    let whereObj = {
      METHOD_CODE: addInfo.METHOD_CODE,
      ITEM_TYPE_CODE: addInfo.ITEM_TYPE_CODE_CNTR,
    };
    let tariffInfo: Tariff = await getTariffSTD(whereObj);
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
    arrReturn.push(Object.assign(tempObj, tariffInfo));
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
}

export default OrderService;
