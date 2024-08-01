'use strict';
import moment from 'moment';
import { genOrderNo } from '../utils/genKey';
import * as https from 'https';

class InvoiceManagementMisa {
  private _access_token: any = null;
  private _responseData: any = null;
  private _config: any = null;
  private _data: any = {
    success: true,
  };
  private _responseContent: string = '';
  private _terminal_code: any = null;

  public get config_site(): any {
    return {
      ROUND_NUM: {
        VND: 0,
        USD: 2,
      },
      ROUND_NUM_Quantity_UNIT: 2,
    };
  }

  public get config(): any {
    return {
      SUPPLIER_TAX_CODE: '0101243150-624',
      HOST: 'testapi.meinvoice.vn',
      IS_HTTPS: true,
      URL: 'https://testapi.meinvoice.vn',
      AUTH_PATH: '/auth/token',
      API_PATH: '/api/v3',
      MISA_TEST_MODE: '1',
      MISA_SRV_ID: 'testmisa@yahoo.com',
      MISA_SRV_PWD: '123456Aa',
      INV_PATTERN: '1/073',
      INV_SERIAL: '1C24TYY',
      MISA_PORTAL_URL: 'https://www.meinvoice.vn/tra-cuu',
      INV_CRE: {
        INV_PATTERN: '1/073',
        INV_SERIAL: '1C24TYY',
      },
    };
  }

  public set config(cfg: any) {
    this._config = cfg;
  }

  public get access_token(): any {
    return this._access_token;
  }
  public set access_token(usid: any) {
    this._access_token = usid;
  }

  public get responseData(): any {
    return this._responseData;
  }
  public set responseData(data: any) {
    this._responseData = data;
  }

  public get responseContent(): string {
    return this._responseContent;
  }
  public set responseContent(content: string) {
    this._responseContent = content;
  }

  public get data(): any {
    return this._data;
  }
  public set data(dt: any) {
    this._data = dt;
  }

  public get terminalCode(): any {
    return this._terminal_code;
  }
  public set terminalCode(ter: any) {
    this._terminal_code = ter;
  }

  public resetValue = (): void => {
    this.responseData = null;
    this.data = {
      success: true,
    };
    this.responseContent = '';
  };

  getErrorMisa = (error: any) => {
    switch (error) {
      case 'UnAuthorize':
      case 'TokenExpiredCode':
        return 'Token hết hạn';
      case 'InvalidTokenCode':
        return 'Token lỗi cần đăng nhập lại';
      case 'DuplicateTemplateName':
        return 'Lỗi trùng tên mẫu';
      case 'DuplicateTemplateNo':
        return 'Lỗi trùng ký hiệu';
      case 'InvoiceTemplateNotExist':
        return 'Mẫu hóa đơn không tồn tại';
      case 'CreateInvoiceDataError':
        return 'Tạo XML hóa đơn lỗi không xác định';
      case 'InvoiceDetail_' + error.split('_')[1]:
        return error.split('_')[1] + '-Không được trống hoặc quá giới hạn kí tự cho phép';
      case 'TaxRateInfo_VATRateName':
        return 'Tên loại thuế suất trong Bảng tổng hợp thuế suất của hóa đơn có dữ liệu không hợp lệ';
      case 'InvoiceQuantityTooLarge':
        return 'Số lượng hóa đơn gửi lên trong 1 Request quá số lượng cho phép';
      case 'XMLTooLong':
        return 'File XML quá dài';
      case 'LicenseInfo_NotBuy':
        return 'Chưa mua tài nguyên';
      case 'LicenseInfo_OutOfInvoice':
        return 'Tài nguyên chưa thanh toán hoặc đã hết hạn';
      case 'RequireError_' + error.split('_')[1]:
        return error.split('_')[1] + '-Không được trống hoặc quá giới hạn kí tự cho phép';
      case 'InvalidTransactionID':
        return 'Mã tra cứu không hợp lệ';
      case 'DuplicateTransactionID':
        return 'Trùng Mã tra cứu';
      case 'SignatureEmpty':
        return 'Chữ ký số bị bỏ trống';
      case 'InvalidSignature':
        return 'Chữ ký số không hợp lệ';
      case 'CertRevocation':
        return 'Chữ ký số đã bị thu hồi';
      case 'InvalidCertByRegistration':
        return 'Chữ ký số không tồn tại trong tờ khai';
      case 'HasRegistrationStopUseCert':
        return 'Tồn tại tờ khai Ngừng sử dụng chứng thư số';
      case 'SigningTimeNotInRegistration':
        return 'Ngày ký không thuộc khoảng thời gian có hiệu lực của chứng thư số đã đăng ký với cơ quan thuế và được CQT chấp nhận';
      case 'InvalidXMLData':
        return 'XML không hợp lệ';
      case 'InvalidInvNo':
        return 'Số hóa đơn không hợp lệ';
      case 'InvalidTaxCode':
        return 'Mã số thuế không hợp lệ';
      case 'DuplicateInvoiceRefID':
        return 'Trùng RefID của hóa đơn';
      case 'InvoiceNumberNotCotinuous':
        return 'Số hóa đơn không liên tục';
      case 'InvoiceDuplicated':
        return 'Trùng hóa đơn - hóa đơn đã được phát hành';
      case 'DeclarationNotExist':
        return 'Chưa tồn tại Tờ khai/Thay đổi thông tin';
      case 'InvalidDeclaration':
        return 'Chưa tồn tại Tờ khai/Thay đổi thông tin có trạng thái CQT chấp nhận';
      case 'ExistDeclarationNotReceive':
        return 'Tồn tại tờ khai có trạng thái: Đã gửi CQT/ CQT Tiếp nhận';
      case 'ExistsInvoiceNextYear':
        return 'Tồn tại hóa đơn của năm tiếp theo';
      case 'InvoiceTemplateNotValidInDeclaration':
        return 'Tờ khai/Thay đổi thông tin không chứa loại hóa đơn đang phát hành';
      case 'InvalidInvoiceDate':
        return 'Ngày hóa đơn không hợp lệ';
      case 'InvoiceCannotReplace':
        return 'Không thể thay thế hóa đơn đã hủy';
      case 'InvoiceCannotAdjust':
        return 'Không thể điều chỉnh hóa đơn đã hủy/thay thế';
      case 'TaxReductionDateInValid':
        return 'Ngày hóa đơn giảm thuế không hợp lệ';
      case 'X509SubjectName':
        return 'Không có SubjectName trên file XML đã ký';
      case 'X509Certificate':
        return 'Không có chứng thư số';
      default:
        return 'Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!';
    }
  };

  ccurl = (data: any, options: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      options.timeout = 550000;
      let url: string | undefined = undefined;
      if (options.url) {
        url = options.url;
        delete options.url;
      }

      const cb = (res: any): void => {
        res.setEncoding('utf8');
        let endWithoutData = true;
        let response = '';
        res.on('data', (chunk: any) => {
          endWithoutData = false;
          if (!chunk) {
            reject('Failed to get response data');
          } else {
            response += chunk;
          }
        });

        res.on('end', () => {
          if (endWithoutData) {
            reject('No more data in response.');
            return;
          }
          resolve(response);
        });
      };

      const req = url ? https.request(url, options, cb) : https.request(options, cb);
      req.on('error', e => {
        reject(`problem with request: ${e.message}`);
      });

      req.write(data);
      req.end();
    });
  };

  async postToMS(path: string, data: string, moreConfig: any = {}): Promise<boolean> {
    this.resetValue();
    const contentType = moreConfig['contentType'] || 'application/json';
    const options: any = {
      isHttps: true,
      hostname: this.config.HOST,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(data),
      },
      maxRedirects: 20,
    };

    if (this.access_token !== null) {
      options.headers['Authorization'] = `Bearer ${this.access_token}`;
    }

    try {
      this.responseContent = await this.ccurl(data, options);
      if (!this.responseContent) {
        this.data.success = false;
        this.data['error'] = '[Misa] Thất bại: Giao dịch với Hệ Thống Hóa Đơn Điện Tử!';
        return false;
      }

      this.responseData = JSON.parse(this.responseContent) || {};
      if (this.responseData['ErrorCode'] && this.responseData['Success'] === false) {
        this.data.success = false;
        this.data['error'] =
          '[Misa] ' +
          this.responseData['ErrorCode'] +
          ' : ' +
          (this.responseData.Errors[0] ||
            this.getErrorMisa(
              this.responseData['ErrorCode'] ||
                this.responseData.DescriptionErrorCode ||
                'Unknown error',
            ));
        return false;
      }

      return true;
    } catch (error: any) {
      console.error(error);
      this.data.success = false;
      this.data['error'] =
        `[Misa] ${error.message || 'Hệ thống đang bảo trì vui lòng thực hiện sau'}`;
      if (this.responseContent) {
        const response = JSON.parse(this.responseContent) || {};
        const errorMsg =
          '[Misa] ' +
          (response['code'] || response['status'] || 200) +
          ' - ' +
          (response['data'] ||
            response['error'] ||
            response['message'] ||
            'Thất bại: Giao dịch với Hệ Thống Hóa Đơn Điện Tử!');
        this.data['error'] = `[Misa] ${errorMsg.trim()}`;
      }
      return false;
    }
  }

  DOCSO = (function () {
    var t = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'],
      r = function (r: any, n: any) {
        var o = '',
          a = Math.floor(r / 10),
          e = r % 10;
        return (
          a > 1
            ? ((o = ' ' + t[a] + ' mươi'), 1 == e && (o += ' mốt'))
            : 1 == a
              ? ((o = ' mười'), 1 == e && (o += ' một'))
              : n && e > 0 && (o = ' lẻ'),
          5 == e && a >= 1
            ? (o += ' lăm')
            : 4 == e && a > 1
              ? (o += ' bốn')
              : (e > 1 || (1 == e && 0 == a)) && (o += ' ' + t[e]),
          o
        );
      },
      n = function (n: any, o: any) {
        var a = '',
          e = Math.floor(n / 100),
          n: any = n % 100;
        return o || e > 0 ? ((a = ' ' + t[e] + ' trăm'), (a += r(n, !0))) : (a = r(n, !1)), a;
      },
      o = function (t: any, r: any) {
        var o = '',
          a = Math.floor(t / 1e6),
          t: any = t % 1e6;
        a > 0 && ((o = n(a, r) + ' triệu'), (r = !0));
        var e = Math.floor(t / 1e3),
          t: any = t % 1e3;
        return e > 0 && ((o += n(e, r) + ' ngàn'), (r = !0)), t > 0 && (o += n(t, r)), o;
      };
    return {
      doc: function (r: any) {
        if (0 == r) return t[0];
        var n = '',
          a = '';
        do {
          const ty = r % 1e9;
          r = Math.floor(r / 1e9);
          n = r > 0 ? o(ty, !0) + a + n : o(ty, !1) + a + n;
          a = ' tỷ';
        } while (r > 0);

        return n.trim();
      },
    };
  })();
  convert_number_to_words = (so: any) => {
    return this.DOCSO.doc(so);
  };

  convert_number_to_words_en = (sotien: any = 0, currency = '') => {
    const decimal = ' point ';
    const Text: any = {
      0: 'zero',
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
      8: 'eight',
      9: 'nine',
      10: 'ten',
      11: 'eleven',
      12: 'twelve',
      13: 'thirteen',
      14: 'fourteen',
      15: 'fifteen',
      16: 'sixteen',
      17: 'seventeen',
      18: 'eighteen',
      19: 'nineteen',
      20: 'twenty',
      30: 'thirty',
      40: 'forty',
      50: 'fifty',
      60: 'sixty',
      70: 'seventy',
      80: 'eighty',
      90: 'ninety',
    };
    const TextLuythua = [
      '',
      'thousand',
      'million',
      'billion',
      'trillion',
      'quadrillion',
      'quintillion',
    ];

    let textnumber = '';
    let fraction = null;
    let prefixReduce_en = '';
    if (sotien < 0) {
      sotien = Math.abs(sotien);
      prefixReduce_en = ' off';
    }

    if (sotien.toString().includes('.')) {
      [sotien, fraction] = sotien.toString().split('.');
    }
    const length = sotien.toString().length;
    const unread = Array(length).fill(0);
    for (let i = 0; i < length; i++) {
      const so = sotien.toString().charAt(length - i - 1);
      if (so == 0 && i % 3 == 0 && unread[i] == 0) {
        let j = 0;
        for (j = i + 1; j < length; j++) {
          const so1 = sotien.toString().charAt(length - j - 1);
          if (so1 != 0) {
            break;
          }
        }
        if ((j - i) / 3 > 0) {
          for (let k = i; k < ((j - i) / 3) * 3 + i; k++) {
            unread[k] = 1;
          }
        }
      }
    }
    for (let i = 0; i < length; i++) {
      const so = sotien.toString().charAt(length - i - 1);
      if (unread[i] == 1) {
        continue;
      }
      if (i % 3 == 0 && i > 0) {
        textnumber = TextLuythua[i / 3] + ' ' + textnumber;
      }
      if (i % 3 == 2) {
        textnumber = 'hundred ' + textnumber;
      }
      if (i == 1 && so == 1) {
        const sox: any = sotien.toString().slice(-2);
        textnumber = Text[sox];
        continue;
      }
      if (i % 3 == 1) {
        textnumber = (so > 0 ? Text[so * 10] : '') + '-' + textnumber;
        continue;
      }
      textnumber = Text[so] + ' ' + textnumber;
    }
    textnumber = textnumber.replace('zero-', '');
    textnumber = textnumber.replace('and zero', '');
    textnumber = textnumber.replace('-zero', '');
    if (fraction !== null && !isNaN(fraction) && parseFloat(fraction) > 0) {
      switch (currency) {
        case 'USD':
          fraction = (fraction + '000000').substring(0, 2);
          textnumber +=
            ' U.S. Dollars and ' + this.convert_number_to_words_en(fraction) + ' Cents.';
          break;
        case 'VND':
          textnumber += ' dong and ' + this.convert_number_to_words_en(fraction) + ' hao.';
          break;
        default:
          textnumber += decimal;
          const words = Array.from(fraction.toString()).map((number: any) => Text[number]);
          textnumber += words.join(' ');
          break;
      }
    } else {
      switch (currency) {
        case 'USD':
          textnumber += ' U.S. Dollars.';
          break;
        case 'VND':
          textnumber += ' dong.';
          break;
      }
    }
    return textnumber + prefixReduce_en;
  };

  getToken = async () => {
    if (!this.config) {
      let cfg = this.config;
      if (cfg.length == 0) {
        this.data['error'] = `[MISA] Không tìm thấy cấu hình hóa đơn điện tử!!!`;
        return false;
      }
      this.config = cfg;
    }

    if (this.access_token) {
      return true;
    }

    var reqData = JSON.stringify({
      appid: '008DE402-F97E-4903-A9E2-4BA5D5EF0C12',
      taxcode: this.config['SUPPLIER_TAX_CODE'],
      username: this.config['MISA_SRV_ID'],
      password: this.config['MISA_SRV_PWD'],
    });

    var path = this.config['API_PATH'] + this.config['AUTH_PATH'];
    var isSuccess = await this.postToMS(path, reqData);
    if (!isSuccess) {
      return false;
    }

    if (!this.responseData['Data']) {
      this.data['error'] =
        `[Misa] ${this.responseData['title']}: ${this.responseData['Errors'][0]}`;
      return false;
    }
    this.access_token = this.responseData['Data'];
    return true;
  };

  retrieveInvoiceTransId = async (orderNo = '') => {
    if (!orderNo) {
      return null;
    }

    if (!(await this.getToken())) {
      this.data.success = false;
      return null;
    }

    //Đường dẫn
    var path = this.config['API_PATH'] + '/code/invoicepublished/invoice-status/refid';
    var isSuccess = await this.postToMS(path, JSON.stringify([orderNo]));
    if (!isSuccess) {
      this.data.success = false;
      return null;
    }

    try {
      var result = JSON.parse(this.responseData['Data']);
      this.data.retrievedInvoice = result[0] || null;
      return this.data.retrievedInvoice;
    } catch (error) {
      this.data.success = false;
      this.data.error = error.message;
      return null;
    }
    // result[0].TransactionID;
    // result[0].InvNo;
    // result[0].InvDate;
    // result[0].ReferenceType;
    // result[0].InvTempl;
    // result[0].InvSeries;
  };

  publish = async (req: any, method: string) => {
    let temps = await this.getToken();
    if (!temps) {
      this.data.success = false;
      return this.data;
    }

    var args = { ...(req.body || {}), ...req };
    let datas = args.datas ? args.datas : [];
    let cusTaxCode = args.cusTaxCode ? args.cusTaxCode : '';
    let cusAddr = args.cusAddr ? args.cusAddr : '';
    let cusName = args.cusName ? args.cusName : '';
    let inv_type = args.inv_type ? args.inv_type : 'VND';
    let roundNum = this.config_site.ROUND_NUM[inv_type];

    var sum_amount = parseFloat(args['sum_amount'] || 0);
    var vat_amount = parseFloat(args['vat_amount'] || 0);
    var total_amount = parseFloat(args['total_amount'] || 0);
    var exchange_rate: any = parseFloat(args['exchange_rate'] || 1);
    var had_exchange = parseInt(args['had_exchange'] || 0);
    var currencyInDetails = datas[0]['CurrencyCode'] || 'VND';

    var paymentMethod = args['paymentMethod'] || 'TM/CK';
    var vat_rate = datas[0]['VatRate'] ? parseFloat(datas[0]['VatRate']) : '';
    var isCredit = args['isCredit'] || false;

    var view_exchange_rate: any = '';
    if (exchange_rate != 1) {
      view_exchange_rate = exchange_rate;
    }

    if (inv_type == currencyInDetails || had_exchange == 1) {
      exchange_rate = 1;
    }

    var sum_amount = sum_amount * exchange_rate;
    var total_amount = total_amount * exchange_rate;
    var vat_amount = vat_amount * exchange_rate;
    var dvt = inv_type == 'VND' ? ' đồng' : ' đô la Mỹ';
    var amount_in_words = this.convert_number_to_words(total_amount) + dvt;
    amount_in_words = amount_in_words.charAt(0).toUpperCase() + amount_in_words.slice(1);

    var orderNo = args.orderNo || datas[0]['orderNo'] || (await genOrderNo(method));
    var cusCode = String(cusTaxCode).trim();

    if (vat_rate === '') {
      vat_rate = '-2';
      vat_amount = 0;
    }

    cusName = cusName.replace(/(\r\n|\n|\r)/gm, '');
    cusAddr = cusAddr.replace(/(\r\n|\n|\r)/gm, '');
    var inv_tplt = this.config['INV_TPLT'];
    var inv_serial = isCredit ? this.config['INV_CRE']['INV_SERIAL'] : this.config['INV_SERIAL'];
    let invoice: any = {
      RefID: orderNo,
      IsInvoiceSummary: false,
      OriginalInvoiceData: {
        IsTaxReduction43: true,
        RefID: orderNo,
        InvSeries: `${inv_serial}`,
        InvoiceName: 'HÓA ĐƠN GIÁ TRỊ GIA TĂNG',
        InvDate: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
        CurrencyCode: currencyInDetails,
        ExchangeRate: exchange_rate,
        PaymentMethodName: paymentMethod,
        IsInvoiceSummary: false,
        BuyerLegalName: cusName,
        BuyerTaxCode: cusCode,
        BuyerAddress: cusAddr,
        BuyerCode: orderNo,
        // "DiscountRate" : null ,
        TotalSaleAmount: sum_amount,
        TotalSaleAmountOC: sum_amount,
        TotalVATAmount: vat_amount,
        TotalVATAmountOC: vat_amount,
        TotalAmount: total_amount,
        TotalAmountOC: total_amount,
        TotalAmountWithoutVATOC: sum_amount,
        TotalAmountWithoutVAT: sum_amount,
        TotalDiscountAmountOC: 0,
        TotalDiscountAmount: 0,
        TotalAmountInWords: amount_in_words,
      },
    };

    //lam tron so luong+don gia theo yeu cau KT
    var roundNumQty_Unit = this.config_site['ROUND_NUM_Quantity_UNIT'];
    var itemInfos = [];
    var TaxRateInfo: any = {};

    for await (let [index, item] of datas.entries()) {
      if (typeof item === 'object') {
        var temp = item['TariffName'];
        var unit = item['UnitCode'];

        //encode content of TRF_DESC because it contain <,> ..
        var itemName = temp.replace(/(\r\n|\n|\r)/gm, '');
        //add info to UNIT CODE
        var unitName = String(unit).trim();

        //them moi lam tron so
        var urate = parseFloat(String(item['UnitRate']).replace(',', ''));
        var i_amt = parseFloat(String(item['Amount']).replace(',', ''));

        var qty = parseFloat(item['Qty']); //lam tron so luong+don gia theo yeu cau KT
        var unitPrice = urate * exchange_rate; //lam tron so luong+don gia theo yeu cau KT
        var amount = i_amt * exchange_rate;

        var taxPerText = item['VatRate']
          ? parseFloat(String(item['VatRate']).replace(',', ''))
          : '-2'; //-2 : Hoa dơn KCT
        var vat_amt: any =
          taxPerText == '-2' ? '' : parseFloat(String(item['Vat']).replace(',', ''));
        var vat: any = taxPerText == '-2' ? '' : vat_amt * exchange_rate;
        switch (taxPerText) {
          case 0:
          case 5:
          case 8:
          case 10:
            taxPerText = taxPerText + '%';
            break;
          case -2:
            taxPerText = 'KCT';
            break;
          default:
            taxPerText = 'KHAC:' + taxPerText + '%';
        }

        var kd = {
          ItemType: 1,
          LineNumber: index + 1,
          SortOrder: index + 1,
          ItemCode: item['TariffCode'],
          ItemName: itemName,
          UnitName: unitName,
          Quantity: qty,
          UnitPrice: unitPrice,
          DiscountRate: 0,
          DiscountAmount: 0,
          DiscountAmountOC: 0,
          AmountWithoutVATOC: amount,
          Amount: amount,
          AmountOC: amount,
          AmountWithoutVAT: amount,
          VATRateName: taxPerText,
          VATAmount: vat_amt,
          VATAmountOC: vat_amt,
        };
        if (taxPerText === 'KCT') {
          delete kd['VATAmount'];
          delete kd['VATAmountOC'];
        }

        itemInfos.push(kd);
        if (!TaxRateInfo[taxPerText]) {
          TaxRateInfo[taxPerText] = {
            VATRateName: taxPerText,
            AmountWithoutVATOC: amount,
            VATAmountOC: vat,
          };
        } else {
          TaxRateInfo[taxPerText]['AmountWithoutVATOC'] += amount;
          if (vat) {
            TaxRateInfo[taxPerText]['VATAmountOC'] += vat;
          }
        }
      }
    }

    if (itemInfos.length == 0) {
      this.data['error'] = 'nothing to publish!';
      this.data.success = false;
      return this.data;
    }

    //add prod detail
    invoice['OriginalInvoiceData']['OriginalInvoiceDetail'] = itemInfos;
    taxPerText === 'KCT'
      ? ''
      : (invoice['OriginalInvoiceData']['TaxRateInfo'] = Object.values(TaxRateInfo));
    invoice['OriginalInvoiceData']['OptionUserDefined'] = {
      MainCurrency: 'VND',
      AmountDecimalDigits: '2',
      AmountOCDecimalDigits: '2',
      UnitPriceOCDecimalDigits: '2',
      UnitPriceDecimalDigits: '2',
      QuantityDecimalDigits: '0',
      CoefficientDecimalDigits: '2',
      ExchangRateDecimalDigits: '2',
      ClockDecimalDigits: '4',
    };

    //thêm đường link vào
    var path = this.config['API_PATH'] + '/code/itg/invoicepublishing/publishHSM';
    var isSuccess = await this.postToMS(path, JSON.stringify([invoice]));
    if (!isSuccess) {
      this.data.success = false;
      return this.data;
    }
    var result = JSON.parse(this.responseData['Data']);

    if (result[0]['ErrorCode']) {
      this.data.success = false;
      this.data.error = this.getErrorMisa(result[0]['ErrorCode']);
      return this.data;
    }

    // this.data["pattern"] = invoice["OriginalInvoiceData"]["InvSeries"]; //invoiceSeries
    this.data['serial'] = inv_serial;
    this.data['fkey'] = orderNo;
    this.data['inv'] = inv_serial + String(result[0]['InvNo']).trim();
    this.data['invno'] = String(result[0]['InvNo']).trim();
    this.data['hddt'] = 1; //them moi hd thu sau
    this.data['InvoiceTransId'] = result[0]['TransactionID']; //them moi hd thu sau
    // this.data["reservationCode"] = result["reservationCode"];
    this.data['invoiceDate'] = moment().format('YYYY-MM-DD HH:mm:ss');
    return this.data;
  };

  cancelInv = async (fkey: any, reason: any, cancelDate: any) => {
    return await this.cancelInvDirectly({
      fkey: fkey,
      cancelDate: cancelDate,
      cancelReason: reason,
    });
  };

  cancelInvDirectly = async (req: any) => {
    if (!(await this.getToken())) {
      this.data.success = false;
      return this.data;
    }

    var args = { ...req.body, ...req };
    var orderNo = args['fkey'] || '';
    var retrieveInv = await this.retrieveInvoiceTransId(orderNo);
    if (!this.data.success) {
      return this.data;
    }
    if (!retrieveInv || !retrieveInv.TransactionID) {
      this.data.success = false;
      this.data.error = 'Không tìm thấy Mã giao dịch!';
      return this.data;
    }

    var InvNo = args['inv'] || '';
    var cancelReason = args['cancelReason'] || '';
    var RefDate = moment().format('YYYY-MM-DD');

    //Đường dẫn
    var path = this.config['API_PATH'] + '/code/itg/invoicepublished/cancel';
    var isSuccess = await this.postToMS(
      path,
      JSON.stringify({
        TransactionID: retrieveInv.TransactionID,
        InvNo: InvNo,
        RefDate: RefDate,
        CancelReason: cancelReason,
      }),
    );

    this.data.success = isSuccess;
    return this.data;
  };

  //get pdf content (byte array)
  getInvView = async (req: any) => {
    if (!(await this.getToken())) {
      this.data.success = false;
      this.data['warning_html'] =
        `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>${this.data.error || 'Can not get token!'}</div>`;
      return this.data;
    }

    var args = { ...(req.params || {}), ...(req.query || {}), ...req };
    var orderNo = args['fkey'] || '';
    var inv = args['inv'] || '';
    var fileType = args['fileType'] || 'pdf';

    //truong hop chi co orderNo + ko co so hoa don
    // retrieve so hoa don tu bang INV_INVOICE

    var retrieveInv = await this.retrieveInvoiceTransId(orderNo);
    if (!this.data.success) {
      this.data.error = this.data.error || 'Can not retrieve transaction id';
      this.data['warning_html'] =
        `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>
            ${this.data.error}
        </div>`;
      return this.data;
    }

    if (!retrieveInv || !retrieveInv.TransactionID) {
      this.data.success = false;
      this.data.error = 'Can not find transaction id!';
      this.data['warning_html'] =
        `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>
            ${this.data.error}
        </div>`;
      return this.data;
    }

    var path =
      this.config['API_PATH'] +
      `/code/itg/invoicepublished/downloadinvoice?downloadDataType=${fileType}`;
    var isSuccess = await this.postToMS(path, JSON.stringify([retrieveInv.TransactionID]));
    if (!isSuccess) {
      this.data.success = false;
      this.data['warning_html'] =
        `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>
        ${this.data['error']}
        </div>`;
      return this.data;
    }

    var dataa = this.responseData['Data'];
    if (!dataa) {
      this.data.success = false;
      this.data.error = 'Can not download data from Invoice System!';
      this.data['warning_html'] =
        `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>
            ${this.data.error}
        </div>`;
      return this.data;
    }

    try {
      var result = JSON.parse(dataa);
      if (!result[0]?.Data) {
        this.data.success = false;
        this.data.error = 'Can not read data from downloaded!';
        this.data['warning_html'] =
          `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>
                ${this.data.error}
            </div>`;
        return this.data;
      }

      this.data['content'] =
        fileType == 'xml' ? result[0]?.Data : Buffer.from(result[0]?.Data, 'base64');
      this.data['fileName'] = `${retrieveInv.TransactionID}.${fileType}`;
      return this.data;
    } catch (error) {
      this.data.success = false;
      this.data.error = error.message;
      return this.data;
    }
  };

  viewDraftInv = async (req: any) => {
    if (!(await this.getToken())) {
      this.data.success = false;
      return this.data;
    }

    var args = { ...(req.body || {}), ...req };
    let datas = args.datas ? args.datas : [];
    let cusTaxCode = args.cusTaxCode ? args.cusTaxCode : '';
    let cusAddr = args.cusAddr ? args.cusAddr : '';
    let cusName = args.cusName ? args.cusName : '';
    let inv_type = args.inv_type ? args.inv_type : 'VND';
    let roundNum = this.config_site.ROUND_NUM[inv_type];

    var sum_amount = parseFloat(args['sum_amount'] || 0);
    var vat_amount = parseFloat(args['vat_amount'] || 0);
    var total_amount = parseFloat(args['total_amount'] || 0);
    var exchange_rate = parseFloat(args['exchange_rate'] || 1);
    var had_exchange = parseInt(args['had_exchange'] || 0);
    var currencyInDetails = datas[0]['CurrencyCode'] || 'VND';

    var paymentMethod = args['paymentMethod'] || 'TM/CK';
    var vat_rate = datas[0]?.VatRate ? parseFloat(datas[0]['VatRate']) : '';

    var view_exchange_rate: any = '';
    if (exchange_rate != 1) {
      view_exchange_rate = exchange_rate;
    }

    if (inv_type == currencyInDetails || had_exchange == 1) {
      exchange_rate = 1;
    }

    var sum_amount = sum_amount * exchange_rate;
    var total_amount = total_amount * exchange_rate;
    var vat_amount = vat_amount * exchange_rate;
    var dvt = inv_type == 'VND' ? ' đồng' : ' đô la Mỹ';
    var amount_in_words = this.convert_number_to_words(total_amount) + dvt;
    amount_in_words = amount_in_words.charAt(0).toUpperCase() + amount_in_words.slice(1);

    var orderNo = await genOrderNo('NK');
    var cusCode = String(cusTaxCode).trim();

    if (vat_rate === '') {
      vat_rate = '-2';
      vat_amount = 0;
    }

    cusName = cusName.replace(/(\r\n|\n|\r)/gm, '');
    cusAddr = cusAddr.replace(/(\r\n|\n|\r)/gm, '');
    var inv_tplt = this.config['INV_TPLT'];
    var inv_serial = this.config['INV_SERIAL'];
    let invoice: any = {
      RefID: orderNo,
      IsTaxReduction43: true,
      InvSeries: `${inv_serial}`,
      InvoiceName: 'HÓA ĐƠN GIÁ TRỊ GIA TĂNG',
      InvDate: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
      CurrencyCode: currencyInDetails,
      ExchangeRate: exchange_rate,
      PaymentMethodName: paymentMethod,
      IsInvoiceSummary: false,
      BuyerLegalName: cusName,
      BuyerTaxCode: cusCode,
      BuyerAddress: cusAddr,
      BuyerCode: orderNo,
      // "DiscountRate" : null ,
      TotalSaleAmount: sum_amount,
      TotalSaleAmountOC: sum_amount,
      TotalVATAmount: vat_amount,
      TotalVATAmountOC: vat_amount,
      TotalAmount: total_amount,
      TotalAmountOC: total_amount,
      TotalAmountWithoutVATOC: sum_amount,
      TotalAmountWithoutVAT: sum_amount,
      TotalDiscountAmountOC: 0,
      TotalDiscountAmount: 0,
      TotalAmountInWords: amount_in_words,
    };

    //lam tron so luong+don gia theo yeu cau KT
    var roundNumQty_Unit = this.config_site['ROUND_NUM_Quantity_UNIT'];
    var itemInfos = [];
    var TaxRateInfo: any = {};

    for await (let [index, item] of datas.entries()) {
      if (typeof item === 'object') {
        var temp = item['TariffName'];
        var unit = item['UnitCode'];
        //encode content of TRF_DESC because it contain <,> ..
        var itemName = temp.replace(/(\r\n|\n|\r)/gm, '');
        //add info to UNIT CODE
        var unitName = String(unit).trim();

        //them moi lam tron so
        var urate = parseFloat(item['UnitRate']);
        var i_amt = parseFloat(item['Amount']);

        var qty = parseFloat(item['Qty']); //lam tron so luong+don gia theo yeu cau KT
        var unitPrice = urate * exchange_rate; //lam tron so luong+don gia theo yeu cau KT
        var amount = i_amt * exchange_rate;

        var taxPerText = item['VatRate']
          ? parseFloat(String(item['VatRate']).replace(',', ''))
          : '-2'; //-2 : Hoa dơn KCT
        var vat_amt: any =
          taxPerText == '-2' ? '' : parseFloat(String(item['Vat']).replace(',', ''));
        var vat = taxPerText == '-2' ? '' : vat_amt * exchange_rate;
        switch (taxPerText) {
          case 0:
          case 5:
          case 8:
          case 10:
            taxPerText = taxPerText + '%';
            break;
          case -2:
            taxPerText = 'KCT';
            break;
          default:
            taxPerText = 'KHAC:' + taxPerText + '%';
        }

        var kd = {
          ItemType: 1,
          LineNumber: index + 1,
          SortOrder: index + 1,
          ItemCode: item['TariffCode'],
          ItemName: itemName,
          UnitName: unitName,
          Quantity: qty,
          UnitPrice: unitPrice,
          DiscountRate: 0,
          DiscountAmount: 0,
          DiscountAmountOC: 0,
          AmountWithoutVATOC: amount,
          Amount: amount,
          AmountOC: amount,
          AmountWithoutVAT: amount,
          VATRateName: taxPerText,
          VATAmount: vat_amt,
          VATAmountOC: vat_amt,
        };
        if (taxPerText === 'KCT') {
          delete kd['VATAmount'];
          delete kd['VATAmountOC'];
        }

        itemInfos.push(kd);
        if (!TaxRateInfo[taxPerText]) {
          TaxRateInfo[taxPerText] = {
            VATRateName: taxPerText,
            AmountWithoutVATOC: amount,
            VATAmountOC: vat,
          };
        } else {
          TaxRateInfo[taxPerText]['AmountWithoutVATOC'] += amount;
          if (vat) {
            TaxRateInfo[taxPerText]['VATAmountOC'] += vat;
          }
        }
      }
    }

    if (itemInfos.length == 0) {
      this.data['error'] = 'nothing to publish!';
      this.data.success = false;
      return this.data;
    }

    //add prod detail
    invoice['OriginalInvoiceDetail'] = itemInfos;
    taxPerText === 'KCT' ? '' : (invoice['TaxRateInfo'] = Object.values(TaxRateInfo));
    invoice['OptionUserDefined'] = {
      MainCurrency: 'VND',
      AmountDecimalDigits: '2',
      AmountOCDecimalDigits: '2',
      UnitPriceOCDecimalDigits: '2',
      UnitPriceDecimalDigits: '2',
      QuantityDecimalDigits: '0',
      CoefficientDecimalDigits: '2',
      ExchangRateDecimalDigits: '2',
      ClockDecimalDigits: '4',
    };

    //thêm đường link vào
    var path = this.config['API_PATH'] + '/code/itg/invoicepublishing/invoicelinkview?type=1';
    var isSuccess = await this.postToMS(path, JSON.stringify(invoice));
    if (!isSuccess) {
      this.data.success = false;
      return this.data;
    }

    if (this.responseData?.ErrorCode) {
      this.data.success = false;
      this.data.error =
        this.responseData?.Errors[0] || this.getErrorMisa(this.responseData?.ErrorCode);
      return this.data;
    }

    if (!this.responseData['Data']) {
      this.data.success = false;
      this.data.error = 'can not get link preview invoice';
      return this.data;
    }

    this.data.linkViewDraft = this.responseData['Data'];
    this.data.success = true;

    return this.data;
  };
}

export default InvoiceManagementMisa;
