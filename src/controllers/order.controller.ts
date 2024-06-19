import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import MethodService from '../services/method.service';
import fs from 'fs';
import path from 'path';
import { createfakeOrderData, findMaxDraftNo, findMaxOrderNo } from '../repositories/order.repo';
import moment from 'moment';
// const data = [
//   {
//     ORDER_NO: 'NKN2406170123',
//     CUSTOMER_CODE: '3300112212',
//     ACC_TYPE: 'string',
//     DELIVERY_ORDER: 'string',
//     BILLOFLADING: 'string',
//     REF_CONTAINER: '0b0de07f-62c0-4a87-94ec-3a5e8299e740',
//     ITEM_TYPE_CODE: 'FF',
//     ITEM_TYPE_CODE_CNTR: 853215,
//     METHOD_CODE: 'F1',
//     ISSUE_DATE: '2024-06-11 06:53:32.280',
//     EXP_DATE: Date,
//     TOTAL_CBM: 12456,
//     HOUSE_BILL: 'string',
//     NOTE: 'string',
//     DRAFT_NO: 'string',
//     INV_NO: 'string',
//     GATE_CHK: true,
//     COMMODITYDESCRIPTION: 'string',
//     CREATE_BY: 'string',
//     CREATE_DATE: '2024-06-11 06:53:32.280',
//     UPDATE_BY: 'string',
//     UPDATE_DATE: '2024-06-11 06:53:32.280',
//   },
// ];

class orderController {
  genOrderNo = async (req: Request, res: Response) => {
    console.log(req.body);
    const { METHOD_CODE } = req.body;
    const initValue = '1';

    const methodCode = METHOD_CODE;
    const formattedDate = moment(new Date()).format('YYMMDD');
    let order_no;

    const date = moment(new Date()).format('DD-MM-YYYY');

    const filePath = path.join(__dirname, `../helpers/order_no_${date}.txt`);

    // trường hợp file chưa tồn tại
    // (1) tạo file
    // (2) query lấy max order no
    //     (2.1) nếu order no max tồn tại khởi tạo file với giá trị order no là max -> gán vào key
    //     (2.2) nếu order no max không tồn tại khởi tạo file với giá trị là 1 -> gán vào key
    if (!fs.existsSync(filePath)) {
      const max = await findMaxOrderNo();

      if (max.lastThreeDigits) {
        fs.writeFileSync(filePath, max.lastThreeDigits.toString());
        order_no = max.lastThreeDigits.toString().padStart(4, '0');
      } else {
        fs.writeFileSync(filePath, initValue);
        order_no = initValue.toString().padStart(4, '0');
      }
    } else {
      // trường hợp file tồn tại
      // (1) đọc file lấy giá trị đã ghi tư trước + 1
      // (2) sau khi giá trị + 1 ghi lại vào file
      order_no = Number.parseInt(fs.readFileSync(filePath, 'utf-8')) + 1;
      order_no = order_no.toString().padStart(4, '0');
      fs.writeFileSync(filePath, order_no.toString());
    }

    const key = methodCode.toUpperCase() + formattedDate + order_no;
    res.json({
      data: key,
    });
  };

  genDraftNo = async (req: Request, res: Response) => {
    const draftStr = 'DR/';
    const year = moment(new Date()).format('YYYY');
    const draftNum = '0000000';
    const initValue = '1';
    let draft_no;

    const filePath = path.join(__dirname, `../helpers/draft_no/draft_no_${year}.txt`);

    const max = await findMaxDraftNo();
    console.log(max);
    if (!fs.existsSync(filePath)) {
      if (max.maxDraftNo) {
        fs.writeFileSync(filePath, max.maxDraftNo.toString());
        draft_no = max.maxDraftNo;
      } else {
        fs.writeFileSync(filePath, initValue);
        draft_no = initValue;
      }
    } else {
      draft_no = Number.parseInt(fs.readFileSync(filePath, 'utf-8')) + 1;
      draft_no = draft_no.toString();
      fs.writeFileSync(filePath, draft_no.toString());
    }

    const key = draftStr + year + '/' + (draftNum + draft_no).slice(-7);

    res.json({
      key,
    });
  };

  // fakeData = async (req: Request, res: Response) => {
  //   const result = await createfakeOrderData(data);
  // };
}

export default new orderController();
