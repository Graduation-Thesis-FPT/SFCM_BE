import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { manager } from '../repositories/index.repo';
import { OrderReqIn } from '../models/deliver-order.model';
import {
  createfakeOrderData,
  findOrder,
  findMaxOrderNo,
  findMaxDraftNo,
  getContList,
  checkContStatus,
  getManifestPackage,
  getTariffSTD,
  saveInOrder
} from '../repositories/order.repo';
import { checkContSize, roundMoney } from '../utils';
import { Tariff } from '../models/tariff.model';
import { Package } from '../models/packageMnfLd.model';

class OrderService {
  static getContList = async (VOYAGEKEY: string, BILLOFLADING: string) => {
    if (!VOYAGEKEY || !BILLOFLADING) {
      throw new BadRequestError(`Mã tàu ${VOYAGEKEY} hoặc số vận đơn không được rỗng!`);
    }
    return getContList(VOYAGEKEY, BILLOFLADING);
  };

  static getManifestPackage = async (VOYAGEKEY: string, CNTRNO: string) => {
    if (!VOYAGEKEY || !CNTRNO) {
      throw new BadRequestError(`Mã tàu hoặc số Container không được rỗng!`);
    }
    const checkStatus = checkContStatus(VOYAGEKEY, CNTRNO);
    if (!checkStatus) {
      throw new BadRequestError(`Số cont ${CNTRNO} đã làm lệnh!`);
    }

    return getManifestPackage(VOYAGEKEY, CNTRNO);
  };

  static getToBillIn = async (dataReq_sualai: Package[], addInfo_s: any) => {
    let arrReturn = [];
    const addInfo = {
      ITEM_TYPE_CODE_CNTR: 'GP',
      METHOD_CODE: 'NK',
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

  static saveInOrder = async (req :OrderReqIn[], createBy: User) => {
    return await saveInOrder(req, createBy);
  };
}
export default OrderService;
