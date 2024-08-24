'use strict';
import moment from 'moment';
import { genOrderNo } from '../utils/genKey';
import * as https from 'https';
import { cancelOrder } from '../repositories/delivery-order.repo';
import { BadRequestError } from '../core/error.response';

class InvoiceManagementBkav {
  private _token: any = null;
  private _responseData: any = null;
  private _data: any = {
    success: true,
  };
  private _responseContent = '';
  private _config: any = null;
  //properties
  get config_site() {
    return {
      ROUND_NUM: {
        VND: 0,
        USD: 2,
      },
      ROUND_NUM_Quantity_UNIT: 2,
    };
  }

  get config() {
    return this._config;
  }
  set config(cfg) {
    this._config = cfg;
  }
  get responseData() {
    return this._responseData;
  }
  set responseData(data) {
    this._responseData = data;
  }

  get responseContent() {
    return this._responseContent;
  }
  set responseContent(content) {
    this._responseContent = content;
  }

  get data() {
    return this._data;
  }
  set data(dt) {
    this._data = dt;
  }

  ccurl = (data: any, options: any, resStatusCode = false): any => {
    return new Promise(async (resolve, reject) => {
      options['timeout'] = 550000;
      let url = undefined;
      if (options.url) {
        url = options.url;
        delete options.url;
      }

      const customResult = (response: any, statusCode: any, message: any) => {
        return !resStatusCode
          ? response
          : {
              response: response,
              statusCode: statusCode,
              statusMessage: message,
            };
      };

      const cb = (res: any): void => {
        res.setEncoding('utf8');
        let endWithoutData = true;
        let response = '';
        res.on('data', (chunk: any) => {
          endWithoutData = false;
          if (!chunk) {
            reject(customResult(response, res.statusCode, '[BKAV] :Không tìm thấy dữ liệu'));
            return;
          } else {
            response += chunk;
          }
        });

        res.on('end', () => {
          if (endWithoutData) {
            return reject(customResult(response, res.statusCode, 'No more data in response.'));
          }
          //console.error(response);
          //console.error(customResult(response, res.statusCode, res.statusMessage));
          return resolve(customResult(response, res.statusCode, res.statusMessage));
        });
      };

      const req = url ? https.request(url, options, cb) : https.request(options, cb);
      req.on('error', (e: any) => {
        return reject(
          customResult(
            `problem with request: ${e.message}`,
            e.code,
            `problem with request: ${e.message}`,
          ),
        );
      });

      req.write(data);
      req.end();
    });
  };

  resetValue = () => {
    this.responseData = null;
    this.data = {
      success: true,
    };
    this.responseContent = '';
  };
  //business
  postToBkav = async (path: any, inputData: any, moreConfig: any = {}) => {
    this.resetValue();
    let contentType = moreConfig['contentType'] || 'application/json';
    let options = {
      isHttps: this.config['is_https'],
      hostname: this.config['HOST'],
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(inputData),
      },
      maxRedirects: 20,
    };

    try {
      const { response, statusCode, statusMessage } = await this.ccurl(inputData, options, true);

      this.responseContent = response;
      if (statusCode !== 200) {
        let respMsg = '';
        try {
          respMsg = JSON.parse(this.responseContent)?.Message;
        } catch {}
        this.data['error'] =
          `[BKAV] [${statusCode}] Thất bại: Giao dịch với Hệ Thống HDDT! ${respMsg || statusMessage}`;
        return false;
      }

      const result = JSON.parse(this.responseContent) || {};
      const data = result.d;
      if (!data) {
        this.data['error'] = `[BKAV] [${statusCode}] Thất bại: ${result.message || statusMessage}`;
        return false;
      }

      //is not a base64
      let objData = Buffer.from(data, 'base64');
      if (objData.toString('base64') !== data) {
        this.data['error'] = `[BKAV] [${statusCode}] Thất bại: ${data || statusMessage}`;
        return false;
      }

      const objResult = JSON.parse(objData.toString());
      if (parseInt(objResult.Status) !== 0) {
        this.data['error'] =
          `[BKAV] [${statusCode}] Thất bại: ${String(objResult.Object || statusMessage)}`;
        return false;
      }

      this.responseData = JSON.parse(objResult.Object);
      return true;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        this.data['error'] = `Lỗi server BKAV: ${error.message}`;
        return false;
      }

      this.data['error'] =
        `[BKAV] [${error.statusCode}] Thất bại: Giao dịch với Hệ Thống HDDT! ${error.statusMessage}`;
      return false;
    }
  };

  retrieveConfig = async () => {
    if (!this.config) {
      const cfg = {
        HOST: 'wsdemo.ehoadon.vn',
        is_https: true,
        BKAV_SRV_ID: '3600334112',
        BKAV_SRV_PWD: 'Bkav@2024',
        API_PATH: '/WSPublicEhoadon.asmx/ExecCommand',
        GUID: 'facca97f-1bbe-4b83-a3d8-9e6550ab44b4',
        INV_PATTERN: '1',
        INV_SERIAL: 'C24TSS',
        INV_CRE: { INV_PATTERN: '1', INV_SERIAL: 'C24TAA' },
      };
      this.config = cfg;
    }
    return true;
  };

  publish = async (req: any, method: string) => {
    if (!(await this.retrieveConfig())) {
      this.data.success = false;
      return this.data;
    }

    let args = { ...(req.body || {}), ...req };
    let datas = args['datas'] || [];
    let cusTaxCode = String(args['cusTaxCode'] || '').trim();
    let cusCode = String(cusTaxCode).trim();
    let cusAddr = String(args['cusAddr'] || '').trim();
    let cusName = String(args['cusName'] || '').trim();
    let inv_type = String(args['inv_type'] || 'VND')
      .trim()
      .toUpperCase();
    let exchange_rate: any = parseFloat(args['exchange_rate'] || 1);

    let paymentMethod = String(args['paymentMethod'] || 'TM/CK')
      .trim()
      .toUpperCase();
    let note = args['note'] || '';
    let invDate = moment(args['invDate'] || undefined);

    var orderNo = args.orderNo || datas[0]['orderNo'] || (await genOrderNo(method));
    let checkTaxCode: any = cusCode.replace('-', '');
    if (isNaN(checkTaxCode) || checkTaxCode.length > 13 || checkTaxCode.length < 10) {
      cusTaxCode = '';
    }

    cusName = cusName.replace(/(\r\n|\n|\r)/gm, '');
    cusAddr = cusAddr.replace(/(\r\n|\n|\r)/gm, '');

    let partnerId = this.config['GUID'];
    let inv_pattern = this.config['INV_PATTERN'];
    let inv_serial = this.config['INV_SERIAL'];
    let payMethod;
    if (paymentMethod == 'TM') {
      payMethod = 1;
    } else if (paymentMethod == 'CK') {
      payMethod = 2;
    } else {
      payMethod = 3;
    }

    let invoiceData: any = {
      CommandObject: [
        {
          PartnerInvoiceID: 0,
          PartnerInvoiceStringID: orderNo,
          Invoice: {
            InvoiceTypeID: 1,
            InvoiceDate: invDate.format('YYYY-MM-DD'),
            BuyerName: '',
            BuyerTaxCode: cusTaxCode,
            BuyerUnitName: cusName,
            BuyerAddress: cusAddr,
            BuyerBankAccount: '',
            ReceiverMobile: '',
            ReceiverAddress: '',
            ReceiverName: '',
            BillCode: '',
            PayMethodID: payMethod,
            ReceiveTypeID: 1,
            Note: note,
            CurrencyID: inv_type,
            ExchangeRate: exchange_rate,
            InvoiceForm: inv_pattern,
            InvoiceSerial: inv_serial,
          },
        },
      ],
      CmdType: 112,
    };

    let itemInfos = [];
    for await (let item of datas) {
      //UNIT_AMT
      if (typeof item === 'object') {
        let unit = item['UnitCode'];
        let temp = item['TariffName'];
        //encode content of TRF_DESC because it contain <,> ..
        let itemName = temp.replace(/(\r\n|\n|\r)/gm, '');
        //add info to UNIT CODE
        let unitName = String(unit).trim();
        let itemcode = String(item['TariffCode']).trim();

        //them moi lam tron so
        let urate = parseFloat(item['UnitRate']);
        let i_amt = parseFloat(item['Amount']);

        let qty = parseFloat(item['QTY']) || 1;
        var unitPrice = urate * exchange_rate; //lam tron so luong+don gia theo yeu cau KT
        var amount = i_amt * exchange_rate;

        //can xu ly them cho chi tiet thue - theo tung dong item (doi voi cac lenh, hien tai dang truyen len tong thue)
        let taxPerText = item['VatRate'] ? parseFloat(item['VatRate']) : '-2'; //-2 : Hoa dơn KCT
        let vat_amt: any = taxPerText == '-2' ? '' : parseFloat(item['Vat']);
        let vat = taxPerText == '-2' ? '' : vat_amt * exchange_rate;

        const objTax = this.getTaxRate(taxPerText);
        const kd: any = {
          // ItemCode: itemcode,
          ItemName: itemName,
          UnitName: unitName,
          QTY: qty,
          Price: unitPrice,
          Amount: amount,
          TaxRateID: objTax.taxRateID,
          TaxRate: objTax.taxRate,
          TaxAmount: vat,
          IsDiscount: false,
          IsIncrease: null,
          ItemTypeID: 0,
        };

        itemInfos.push(kd);
      }
    }

    if (itemInfos.length == 0) {
      this.data['error'] = 'nothing to publish!';
      this.data.success = false;
      return this.data;
    }

    //add prod detail
    invoiceData.CommandObject[0].ListInvoiceDetailsWS = itemInfos;
    let invoice = {
      partnerGUID: partnerId,
      CommandData: Buffer.from(JSON.stringify(invoiceData)).toString('base64'),
    };

    let path = this.config['API_PATH'];
    let isSuccess = await this.postToBkav(path, JSON.stringify(invoice));
    if (!isSuccess) {
      this.data.success = false;
      return this.data;
    }

    const result = { ...this.responseData[0] };
    if (result.Status) {
      this.data.error = `[BKAV] ${result.MessLog || 'Lỗi phát hành vui lòng thông báo quản trị viên!'}`;
      this.data.success = false;
      return this.data;
    }

    this.data['pattern'] = String(result.InvoiceForm);
    this.data['serial'] = String(result.InvoiceSerial);

    this.data['fkey'] = orderNo;
    this.data['inv'] = `${this.data['serial']}${result.InvoiceNo}`;
    this.data['invno'] = result.InvoiceNo;
    this.data['hddt'] = 1; //them moi hd thu sau
    this.data['invoiceDate'] = invDate.format('YYYY-MM-DD HH:mm:ss');
    this.data['OrderNo'] = datas[0]['OrderNo'];
    this.data['JobModeCode'] = datas[0]['JobModeCode'];
    this.data['main'] = datas[0].hasOwnProperty('main') ? datas[0]['main'] : true;
    return this.data;
  };

  getInvView = async (req: any) => {
    if (!(await this.retrieveConfig())) {
      this.data.success = false;
      this.data['warning_html'] =
        `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>${this.data.error || 'Can not get token!'}</div>`;
      return this.data;
    }

    let args = { ...(req.params || {}), ...(req.query || {}), ...req };
    let fkey = args['fkey'] || '';
    let inv = args['inv'] || '';
    let fileType = String(args['fileType'] || 'PDF')
      .trim()
      .toUpperCase();

    if (!fkey) {
      this.data.success = false;
      this.data['warning_html'] =
        `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>
                                                            Vui lòng nhập đầy đủ thông tin tra cứu!
                                                        </div>`;
      return this.data;
    }
    let inputData = {
      partnerGUID: this.config['GUID'],
      CommandData: Buffer.from(
        JSON.stringify({
          CmdType: fileType == 'XML' ? 809 : 808,
          CommandObject: fkey,
        }),
      ).toString('base64'),
    };

    let path = this.config['API_PATH'];
    let isSuccess = await this.postToBkav(path, JSON.stringify(inputData));
    if (!isSuccess) {
      this.data.success = false;
      this.data['warning_html'] =
        `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>
            ${this.data['error']}
            </div>`;
      return this.data;
    }

    let base64File = this.responseData[fileType];
    if (!base64File) {
      this.data.success = false;
      this.data['warning_html'] =
        `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>
                Không thể tải tệp từ hệ thống HDDT
            </div>`;
      return this.data;
    }

    this.data['content'] = Buffer.from(base64File, 'base64');
    this.data['fileName'] = fkey;
    return this.data;
  };

  cancelInv = async (fkey: any, reason: any, cancelDate: any, invNo: any = '') => {
    return await this.cancelInvDirectly({
      fkey: fkey,
      cancelDate: cancelDate,
      cancelReason: reason,
      invNo: invNo,
    });
  };

  cancelInvDirectly = async (req: any) => {
    if (!(await this.retrieveConfig())) {
      this.data.success = false;
      return this.data;
    }

    let args = { ...req.body, ...req };
    let InvNo = args['invNo'] || '';
    let fkey = args['fkey'] || '';
    let cancelReason = args['cancelReason'] || '';

    let path = this.config['API_PATH'];
    let cmdData = {
      CmdType: 202,
      CommandObject: [
        {
          PartnerInvoiceID: 0,
          PartnerInvoiceStringID: fkey,
          Invoice: {
            InvoiceTypeID: 1,
            Reason: cancelReason,
          },
        },
      ],
    };

    let inputData = {
      partnerGUID: this.config['GUID'],
      CommandData: Buffer.from(JSON.stringify(cmdData)).toString('base64'),
    };
    let isSuccess = await this.postToBkav(path, JSON.stringify(inputData));
    if (!isSuccess) {
      this.data.success = false;
      return this.data;
    }
    if (JSON.parse(JSON.parse(atob(JSON.parse(this.responseContent)?.d))?.Object)[0]?.Status) {
      throw new BadRequestError(`Cơ quan thuế đang duyệt hóa đơn phát hành!!!`);
    }
    await cancelOrder(InvNo, cancelReason);
    this.data.success = true;
    return this.data;
  };

  getTaxRate = (taxPerText: any) => {
    // ID thuế suất:    1 - 0%  | 2- 5% |  3 - 10% |  4 - Không chịu thuế|  5 - Không kê khai thuế | 6 - Thuế suất khác
    // Chi tiết thuế suất:    0 – 0% | 5 -  5% | 10 -10% | -1 – Không chịu thuế | -2 – Không kê khai thuế | -4 -  xxx
    switch (taxPerText) {
      case 0:
        return {
          taxRateID: 1,
          taxRate: taxPerText,
        };
      case 5:
        return {
          taxRateID: 2,
          taxRate: taxPerText,
        };
      case 10:
        return {
          taxRateID: 3,
          taxRate: taxPerText,
        };
      case -2:
        return {
          taxRateID: 4,
          taxRate: -1,
        };
      default:
        return {
          taxRateID: 6,
          taxRate: taxPerText,
        };
    }
  };
}

export default InvoiceManagementBkav;
