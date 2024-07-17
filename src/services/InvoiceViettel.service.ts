// import * as https from 'https';
// import { genOrderNo } from '../utils/genKey';

// class InvoiceManagementVT {
//   private _access_token: any = null;
//   private _responseData: any = null;
//   private _data = {
//     success: true,
//   };
//   private _responseContent = '';

//   //properties
//   get config_site(): any {
//     return {
//       ROUND_NUM: {
//         VND: 0,
//         USD: 2,
//       },
//       ROUND_NUM_Quantity_UNIT: 2,
//     };
//   }
//   get config() {
//     return {
//       SUPPLIER_TAX_CODE: '0100109106-784',
//       HOST: 'api-vinvoice.viettel.vn',
//       IS_HTTPS: true,
//       URL: 'https://api-vinvoice.viettel.vn',
//       AUTH_PATH: '/auth/login',
//       API_PATH: '/services/einvoiceapplication/api/InvoiceAPI',
//       VT_TEST_MODE: '0',
//       SRV_ID: '0100109106-784_deli',
//       SRV_PWD: '111111a@A',
//       INV_PATTERN: '1/073',
//       INV_SERIAL: 'K23THP',
//       PORTAL_URL: 'https://sinvoice.viettel.vn/tracuuhoadon',
//       INV_CRE: {
//         INV_PATTERN: '1/073',
//         INV_SERIAL: 'K23THP',
//       },
//     };
//   }

//   get access_token() {
//     return this._access_token;
//   }
//   set access_token(usid: any) {
//     this._access_token = usid;
//   }

//   get responseData() {
//     return this._responseData;
//   }
//   set responseData(data: any) {
//     this._responseData = data;
//   }

//   get responseContent() {
//     return this._responseContent;
//   }
//   set responseContent(content: any) {
//     this._responseContent = content;
//   }

//   get data() {
//     return this._data;
//   }
//   set data(dt: any) {
//     this._data = dt;
//   }

//   ccurl = (data: any, options: any): Promise<any> => {
//     return new Promise((resolve, reject) => {
//       options.timeout = 550000;
//       let url: string | undefined = undefined;
//       if (options.url) {
//         url = options.url;
//         delete options.url;
//       }

//       const cb = (res: any): void => {
//         res.setEncoding('utf8');
//         let endWithoutData = true;
//         let response = '';
//         res.on('data', (chunk: any) => {
//           endWithoutData = false;
//           if (!chunk) {
//             reject('Failed to get response data');
//           } else {
//             response += chunk;
//           }
//         });

//         res.on('end', () => {
//           if (endWithoutData) {
//             reject('No more data in response.');
//             return;
//           }
//           resolve(response);
//         });
//       };

//       const req = url ? https.request(url, options, cb) : https.request(options, cb);
//       req.on('error', e => {
//         reject(`problem with request: ${e.message}`);
//       });

//       req.write(data);
//       req.end();
//     });
//   };

//   async postToVT(path: any, data: any, moreConfig: any = {}) {
//     var contentType = moreConfig['contentType'] || 'application/json';
//     var options: any = {
//       isHttps: true,
//       hostname: this.config.HOST,
//       path: path,
//       headers: {
//         'Content-Type': contentType,
//         'Content-Length': Buffer.byteLength(data),
//       },
//       maxRedirects: 20,
//     };

//     if (this.access_token !== null) {
//       options.headers['Cookie'] = `access_token=${this.access_token}`;
//     }

//     try {
//       this.responseContent = await this.ccurl(data, options);
//       if (!this.responseContent) {
//         this.data['error'] = '[VTL] Thất bại: Giao dịch với Hệ Thống Hóa Đơn Điện Tử!';
//         return false;
//       }

//       this.responseData = JSON.parse(this.responseContent) || {};
//       if (this.responseData['errorCode'] && this.responseData['errorCode'] != 200) {
//         this.data['error'] =
//           '[VT] ' + this.responseData['errorCode'] + ' : ' + this.responseData['description'];
//         return false;
//       } else if (this.responseData['code'] && this.responseData['code'] != 200) {
//         this.data['error'] =
//           '[VT] ' +
//           this.responseData['code'] +
//           ' : ' +
//           (this.responseData['data'] || this.responseData['message']);
//         return false;
//       }

//       return true;
//     } catch (error) {
//       console.log(error);
//       this.data['error'] = `[VTL] ${error.message}`;

//       if (this.responseContent) {
//         let response = JSON.parse(this.responseContent) || {};
//         let errorMsg =
//           '[VTL] ' +
//           (response['code'] || response['status'] || 200) +
//           ' - ' +
//           (response['data'] ||
//             response['error'] ||
//             response['message'] ||
//             'Thất bại: Giao dịch với Hệ Thống Hóa Đơn Điện Tử!');
//         this.data['error'] = `[VTL] ${errorMsg.trim()}`;
//       }
//       return false;
//     }
//   }
//   DOCSO = (function () {
//     var t = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'],
//       r = function (r: any, n: any) {
//         var o = '',
//           a = Math.floor(r / 10),
//           e = r % 10;
//         return (
//           a > 1
//             ? ((o = ' ' + t[a] + ' mươi'), 1 == e && (o += ' mốt'))
//             : 1 == a
//               ? ((o = ' mười'), 1 == e && (o += ' một'))
//               : n && e > 0 && (o = ' lẻ'),
//           5 == e && a >= 1
//             ? (o += ' lăm')
//             : 4 == e && a > 1
//               ? (o += ' bốn')
//               : (e > 1 || (1 == e && 0 == a)) && (o += ' ' + t[e]),
//           o
//         );
//       },
//       n = function (n: any, o: any) {
//         var a = '',
//           e = Math.floor(n / 100),
//           n: any = n % 100;
//         return o || e > 0 ? ((a = ' ' + t[e] + ' trăm'), (a += r(n, !0))) : (a = r(n, !1)), a;
//       },
//       o = function (t: any, r: any) {
//         var o = '',
//           a = Math.floor(t / 1e6),
//           t: any = t % 1e6;
//         a > 0 && ((o = n(a, r) + ' triệu'), (r = !0));
//         var e = Math.floor(t / 1e3),
//           t: any = t % 1e3;
//         return e > 0 && ((o += n(e, r) + ' ngàn'), (r = !0)), t > 0 && (o += n(t, r)), o;
//       };
//     return {
//       doc: function (r: any) {
//         if (0 == r) return t[0];
//         var n = '',
//           a = '';
//         do {
//           const ty = r % 1e9;
//           r = Math.floor(r / 1e9);
//           n = r > 0 ? o(ty, !0) + a + n : o(ty, !1) + a + n;
//           a = ' tỷ';
//         } while (r > 0);

//         return n.trim();
//       },
//     };
//   })();
//   convert_number_to_words = (so: any) => {
//     return this.DOCSO.doc(so);
//   };

//   async getToken() {
//     var reqData = JSON.stringify({
//       username: this.config['SRV_ID'],
//       password: this.config['SRV_PWD'],
//     });

//     var path = this.config['AUTH_PATH'];
//     var isSuccess = await this.postToVT(path, reqData);
//     if (!isSuccess) {
//       return false;
//     }

//     if (!this.responseData['access_token']) {
//       this.data['error'] = `[VTL] ${this.responseData['title']}: ${this.responseData['message']}`;
//       return false;
//     }

//     this.access_token = this.responseData['access_token'];
//     return true;
//   }

//   dateTimeToMillisecond(dateTime: any = null) {
//     var format = 'YYYY-MM-DD HH:mm:ss.SSS';
//     if (!dateTime) {
//       dateTime = FunctionModel.moment().format(format);
//     }

//     var local_timestamp = FunctionModel.moment(FunctionModel.dbDateTime(dateTime, format)).unix();
//     // date_default_timezone_set('UTC');
//     // utcDateTime = date("Y-m-d H:i:s.v", local_timestamp);
//     // utc_timestamp = strtotime(utcDateTime);
//     return local_timestamp * 1000;
//   }

//   async publish(req: any) {
//     var args = req.body;
//     var datas = args['datas'] ? args['datas'] : [];
//     var cusTaxCode = args['cusTaxCode'] ? args['cusTaxCode'] : '';
//     var cusAddr = args['cusAddr'] ? args['cusAddr'] : '';
//     var cusName = args['cusName'] ? args['cusName'] : '';
//     var inv_type = args['inv_type'] || 'VND';
//     var roundNum = this.config_site.ROUND_NUM[inv_type]; //ROUND_NUM_Quantity_UNIT

//     var sum_amount = parseFloat(args['sum_amount'] || 0);
//     var vat_amount = parseFloat(args['vat_amount'] || 0);
//     var total_amount = parseFloat(args['total_amount'] || 0);
//     var exchange_rate = parseFloat(args['exchange_rate'] || 1);
//     var had_exchange = parseInt(args['had_exchange'] || 0);
//     var currencyInDetails = datas[0]['CurrencyCode'] || 'VND';

//     var paymentMethod = args['paymentMethod'] || 'TM/CK';
//     var shipInfo = args['shipInfo'] || null;
//     var shipKey = args['shipKey'] || '';
//     var note = args['note'] || '';
//     var invDate = args['invDate'] || null;
//     var vat_rate = datas[0]['VatRate'] ? parseFloat(datas[0]['VatRate']) : '';
//     var isCredit = args['isCredit'] || false;

//     var view_exchange_rate: any = '';
//     if (exchange_rate != 1) {
//       view_exchange_rate = exchange_rate;
//     }

//     if (inv_type == currencyInDetails || had_exchange == 1) {
//       exchange_rate = 1;
//     }

//     var sum_amount = sum_amount * exchange_rate;
//     var total_amount = total_amount * exchange_rate;
//     var vat_amount = vat_amount * exchange_rate;
//     var amount_in_words = this.convert_number_to_words(total_amount); //doc tien usd
//     amount_in_words = amount_in_words.charAt(0).toUpperCase() + amount_in_words.slice(1);

//     var orderNo = args.orderNo || datas[0]['orderNo'] || (await genOrderNo('NK'));

//     var cusCode = String(cusTaxCode).trim();
//     /* checkTaxCode = str_replace('-', "", cusCode);
//         if (!in_array(strlen(checkTaxCode), array(10, 13)) || !is_numeric(checkTaxCode)) {
//             cusTaxCode = "";
//         }*/

//     if (vat_rate === '') {
//       vat_rate = '-2';
//       vat_amount = 0;
//     }

//     cusName = cusName.replace(/(\r\n|\n|\r)/gm, '');
//     cusAddr = cusAddr.replace(/(\r\n|\n|\r)/gm, '');

//     var inv_pattern = isCredit ? this.config['INV_CRE']['INV_PATTERN'] : this.config['INV_PATTERN'];
//     var inv_serial = isCredit ? this.config['INV_CRE']['INV_SERIAL'] : this.config['INV_SERIAL'];
//     var invoice = {
//       generalInvoiceInfo: {
//         invoiceType: '1',
//         templateCode: inv_pattern,
//         transactionUuid: orderNo,
//         invoiceSeries: inv_serial,
//         invoiceIssuedDate: this.dateTimeToMillisecond(invDate),
//         currencyCode: inv_type,
//         adjustmentType: '1', //hoa don goc
//         paymentStatus: true,
//         paymentType: paymentMethod,
//         paymentTypeName: paymentMethod,
//         cusGetInvoiceRight: true,
//         exchangeRate: view_exchange_rate,
//       },
//       buyerInfo: {
//         buyerCode: cusCode,
//         buyerName: cusName,
//         buyerLegalName: cusName,
//         buyerTaxCode: cusTaxCode,
//         buyerAddressLine: cusAddr,
//         buyerPhoneNumber: '',
//         buyerEmail: '',
//         buyerIdNo: '',
//         buyerIdType: '',
//         buyerBankAccount: '',
//         buyerBankName: '',
//       },
//       // "sellerInfo": new stdClass(),
//       extAttribute: [
//         {
//           key: 'reservationCode',
//           value: orderNo,
//         },
//       ],
//       payments: [
//         {
//           paymentMethodName: paymentMethod,
//         },
//       ],
//       // "deliveryInfo": [],
//       itemInfo: [],
//       discountItemInfo: [],
//       summarizeInfo: {
//         sumOfTotalLineAmountWithoutTax: sum_amount,
//         totalAmountWithoutTax: sum_amount,
//         totalTaxAmount: vat_amount,
//         totalAmountWithTax: total_amount,
//         totalAmountWithTaxInWords: '',
//         discountAmount: 0,
//         settlementDiscountAmount: 0,
//         taxPercentage: vat_rate,
//       },
//       taxBreakdowns: [],
//       metadata: [
//         {
//           id: 1464,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'quốc tịch',
//           keyTag: 'flag',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['NationID'] ?? '',
//         },
//         {
//           id: 1465,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'trọng tải',
//           keyTag: 'grossTomage',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: parseFloat(shipInfo['DWT'] || 0) > 0 ? shipInfo['DWT'] : '',
//         },
//         {
//           id: 1466,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Ngày đến',
//           keyTag: 'arrival',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['ATB']
//             ? FunctionModel.moment(shipInfo['ATB']).format('DD/MM/YYYY')
//             : '',
//         },
//         {
//           id: 1467,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Ngày đi',
//           keyTag: 'depature',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['ATD']
//             ? FunctionModel.moment(shipInfo['ATD']).format('DD/MM/YYYY')
//             : '',
//         },
//         {
//           id: 1468,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'nơi đậu',
//           keyTag: 'berth',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['BerthID'] ?? '',
//         },
//         {
//           id: 1469,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Căn cứ',
//           keyTag: 'basedOn',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: orderNo,
//         },
//         {
//           id: 1470,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Loại hàng',
//           keyTag: 'type',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//         {
//           id: 901,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Tên tàu',
//           keyTag: 'vesselVoyage',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue:
//             shipInfo['VesselName'] +
//             ' ' +
//             shipInfo['InboundVoyage'] +
//             ' / ' +
//             shipInfo['OutboundVoyage'],
//         },
//         {
//           id: 7777,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Tên CN',
//           keyTag: 'branchName',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//         {
//           id: 8888,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Địa chỉ CN',
//           keyTag: 'branchAddress',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//         {
//           id: 9999,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Mã số thuế CN',
//           keyTag: 'branchTaxCode',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//       ],
//     };

//     //lam tron so luong+don gia theo yeu cau KT
//     var roundNumQty_Unit = this.config_site['ROUND_NUM_Quantity_UNIT'];
//     var itemInfos = [];
//     var taxBreakdowns = {};
//     for await (let item of datas) {
//       //UNIT_AMT
//       if (typeof item === 'object') {
//         var temp = item['TRFDesc'];
//         var unit = await Utils.getUnitName(item['UnitID']);
//         var moreDesc = item['TRFDescMore'] ? String(item['TRFDescMore']).trim() : '';
//         var cntrList = item['Remark'] ? String(item['Remark']).trim() : '';

//         if (cntrList.split(',').length > 5) {
//           //nhieu hon 5cont
//           temp += ' ' + moreDesc.split('||')[0];
//           //lenh nang ha + dong rut : moreDesc = BLNO / BKNO
//           //lenh luu bai + dien lanh : moreDesc = BLNO / BKNO || UETU5196773: 18/02/2022 14:17:09 - 29/03/2022 14:04|TGBU8763621: ....
//         } else if (moreDesc.includes('||')) {
//           //it hon 5cont + ccó chuỗi ||.luubai + dien lanh (desc co dang: BLNO/BKNO || .... ....)
//           temp += ` (${moreDesc})`;
//         } else {
//           temp += ' ' + (cntrList || moreDesc); //nguoc lai su dung list cont
//         }

//         //encode content of TRF_DESC because it contain <,> ..
//         var itemName = Common.htmlspecialchars(temp.replace(/(\r\n|\n|\r)/gm, ''));
//         //add info to UNIT CODE
//         var unitName = Common.htmlspecialchars(unit);

//         //them moi lam tron so
//         var urate = parseFloat(item['UnitPrice'].replace(',', ''));
//         var i_amt = parseFloat(item['Amount'].replace(',', ''));

//         var qty = parseFloat(item['Quantity']).toFixed(roundNumQty_Unit); //lam tron so luong+don gia theo yeu cau KT
//         var unitPrice = parseFloat(urate * exchange_rate).toFixed(roundNumQty_Unit); //lam tron so luong+don gia theo yeu cau KT
//         var amount = parseFloat(i_amt * exchange_rate).toFixed(roundNum);
//         var taxPerText = item['VatRate'] ? parseFloat(item['VatRate'].replace(',', '')) : '-2'; //-2 : Hoa dơn KCT
//         var vat_amt = taxPerText == '-2' ? '' : parseFloat(item['VatAmount'].replace(',', ''));
//         var vat = taxPerText == '-2' ? '' : parseFloat(vat_amt * exchange_rate).toFixed(roundNum);
//         var kd = {
//           itemCode: '',
//           itemName: itemName,
//           unitName: unitName,
//           unitPrice: unitPrice,
//           quantity: qty,
//           itemTotalAmountWithoutTax: amount,
//           taxPercentage: taxPerText,
//           taxAmount: vat,
//           discount: 0,
//           itemDiscount: 0,
//         };
//         itemInfos.push(kd);

//         if (!taxBreakdowns[taxPerText]) {
//           taxBreakdowns[taxPerText] = {
//             taxPercentage: taxPerText,
//             taxableAmount: amount,
//             taxAmount: vat,
//           };
//         } else {
//           taxBreakdowns[taxPerText]['taxableAmount'] += parseFloat(amount);
//           if (vat) {
//             taxBreakdowns[taxPerText]['taxAmount'] += parseFloat(vat);
//           }
//         }
//       }
//     }

//     if (itemInfos.length == 0) {
//       this.data['error'] = 'nothing to publish!';
//       this.data.success = false;
//       return this.data;
//     }

//     if (note) {
//       itemInfos.push({
//         itemName: note,
//         selection: 2,
//       });
//     }

//     //add prod detail
//     invoice['itemInfo'] = itemInfos;
//     invoice['taxBreakdowns'] = Object.values(taxBreakdowns);

//     if (!this.access_token) {
//       if (!(await this.getToken())) {
//         this.data.success = false;
//         return this.data;
//       }
//     }

//     var path =
//       this.config['API_PATH'] + '/InvoiceWS/createInvoice/' + this.config['SUPPLIER_TAX_CODE'];
//     var isSuccess = await this.postToVT(path, JSON.stringify(invoice));
//     if (!isSuccess) {
//       this.data.success = false;
//       return this.data;
//     }

//     var result = this.responseData['result'];
//     this.data['pattern'] = invoice['generalInvoiceInfo']['templateCode']; //invoiceSeries
//     this.data['serial'] = invoice['generalInvoiceInfo']['invoiceSeries'];
//     this.data['fkey'] = orderNo;
//     this.data['inv'] = result['invoiceNo'];
//     this.data['invno'] = String(result['invoiceNo']).replace(
//       invoice['generalInvoiceInfo']['invoiceSeries'],
//       '',
//     );
//     this.data['hddt'] = 1; //them moi hd thu sau
//     this.data['reservationCode'] = result['reservationCode'];
//     this.data['invoiceDate'] = FunctionModel.moment
//       .unix(invoice['generalInvoiceInfo']['invoiceIssuedDate'] / 1000)
//       .format('YYYY-MM-DD HH:mm:ss');

//     return this.data;
//   }

//   async downloadInvPDF(req) {
//     return this.getInvView(req);
//   }

//   async getInvView(req) {
//     var args = { ...req.params, ...req.query };
//     var pattern = args['pattern'] || this.config['INV_PATTERN'];
//     var fkey = args['fkey'] || '';
//     var inv = args['inv'] || '';
//     if (fkey && !inv) {
//       var temp = req
//         .gtos('INV_INVOICE')
//         .select('InvNo')
//         .where('orderNo', fkey)
//         .limit(1)
//         .order_by('InvDate', 'DESC')
//         .catch(err => console.log(err));
//       if (!temp) {
//         this.data.success = false;
//         this.data['warning_html'] =
//           `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>Không tìm thấy thông tin hoá đơn này!</div>`;
//         return this.data;
//       }

//       inv = temp[0]['InvNo'];
//     }

//     if (!this.access_token) {
//       if (!(await this.getToken())) {
//         this.data.success = false;
//         this.data['warning_html'] =
//           `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>${this.data.error || 'Can not get token!'}</div>`;
//         return this.data;
//       }
//     }

//     var inputData = {
//       supplierTaxCode: this.config['SUPPLIER_TAX_CODE'],
//       templateCode: pattern,
//       invoiceNo: inv,
//       fileType: 'pdf',
//     };

//     var path = this.config['API_PATH'] + '/InvoiceUtilsWS/getInvoiceRepresentationFile';
//     var isSuccess = await this.postToVT(path, JSON.stringify(inputData));
//     if (!isSuccess) {
//       this.data.success = false;
//       this.data['warning_html'] =
//         `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>${this.data['error']}</div>`;
//       return this.data;
//     }

//     var base64File = this.responseData['fileToBytes'];
//     if (!base64File) {
//       this.data.success = false;
//       this.data['warning_html'] =
//         `<div style='width: 100vw;text-align: center;margin: -8px 0 0 -8px;font-weight: 600;font-size: 27px;color: white;background-color:#614040;line-height: 2;'>Không thể tải tệp từ hệ thống HDDT</div>`;
//       return this.data;
//     }

//     this.data['content'] = Buffer.from(base64File, 'base64');
//     this.data['fileName'] = this.responseData['fileName'];
//     return this.data;
//   }

//   async viewDraftInv(req) {
//     var args = req.body;
//     var datas = args['datas'] ? args['datas'] : [];
//     var cusTaxCode = args['cusTaxCode'] ? args['cusTaxCode'] : '';
//     var cusAddr = args['cusAddr'] ? Common.htmlspecialchars(args['cusAddr']) : '';
//     var cusName = args['cusName'] ? Common.htmlspecialchars(args['cusName']) : '';
//     var inv_type = args['inv_type'] || 'VND';
//     var roundNum = this.config_site['ROUND_NUM'][inv_type]; //ROUND_NUM_Quantity_UNIT

//     var sum_amount = args['sum_amount'] ? parseFloat(args['sum_amount'].replace(',', '')) : '';
//     var vat_amount = args['vat_amount'] ? parseFloat(args['vat_amount'].replace(',', '')) : '';
//     var total_amount = args['total_amount']
//       ? parseFloat(args['total_amount'].replace(',', ''))
//       : '';
//     var exchange_rate = args['exchange_rate']
//       ? parseFloat(args['exchange_rate'].replace(',', ''))
//       : 1;
//     var had_exchange = parseInt(args['had_exchange'] || 0);

//     var currencyInDetails = datas[0]['CurrencyCode'] || 'VND';
//     var paymentMethod = args['paymentMethod'] || 'TM/CK';
//     var shipInfo = args['shipInfo'] || null;
//     var shipKey = args['shipKey'] || '';
//     var vat_rate = datas[0]['VatRate'] ? parseFloat(datas[0]['VatRate'].replace(',', '')) : '';
//     var isCredit = args['isCredit'] || false;

//     var old_pincode = args['old_pincode'] || '';
//     var old_invNo = args['old_invNo'] || '';
//     var old_invDate = args['old_invDate'] || '';
//     var invDate = args['invDate'] || null;
//     var note = args['note'] || '';

//     var adjust_type_text = args['adjust_type'] || ''; //3: THAY THE | 5.1.1: DIEU CHINH TANG TIEN | 5.1.2: DIEU CHINH GIAM TIEN | 5.2: DIEU CHINH TT
//     var adjust_infor = adjust_type_text.split('.');
//     var adjust_type = adjust_infor[0] || '';
//     var adjust_inv_type = adjust_infor[1] || '';
//     var isIncreament = !adjust_infor[2] ? null : adjust_infor[2] == '1';
//     if (adjust_type_text && !adjust_type) {
//       this.data['error'] = 'Loại điều chỉnh không phù hợp!';
//       this.data.success = false;
//       return this.data;
//     }

//     if (!shipInfo && shipKey) {
//       shipInfo = await this.searchShip(req.gtos, shipKey);
//     }

//     var view_exchange_rate = '';
//     if (exchange_rate != 1) {
//       view_exchange_rate = exchange_rate;
//     }

//     if (inv_type == currencyInDetails || had_exchange === 1) {
//       exchange_rate = 1;
//     }

//     var sum_amount = parseFloat(sum_amount * exchange_rate).toFixed(roundNum);
//     var total_amount = parseFloat(total_amount * exchange_rate).toFixed(roundNum);
//     var vat_amount = parseFloat(vat_amount * exchange_rate).toFixed(roundNum);
//     var amount_in_words = Common.convert_number_to_words(total_amount, inv_type); //doc tien usd
//     var amount_in_words = Common.htmlspecialchars(amount_in_words);
//     var orderNo = await OrderModel.generatePinCode(req);
//     var cusCode = String(cusTaxCode).trim();
//     /* checkTaxCode = str_replace('-', "", cusCode);
//         if (!in_array(strlen(checkTaxCode), array(10, 13)) || !is_numeric(checkTaxCode)) {
//             cusTaxCode = "";
//         }*/

//     if (vat_rate === '') {
//       vat_rate = '-2';
//       vat_amount = '';
//     }

//     cusName = cusName.replace(/(\r\n|\n|\r)/gm, '');
//     cusAddr = cusAddr.replace(/(\r\n|\n|\r)/gm, '');

//     var inv_pattern = isCredit ? this.config['INV_CRE']['INV_PATTERN'] : this.config['INV_PATTERN'];
//     var inv_serial = isCredit ? this.config['INV_CRE']['INV_SERIAL'] : this.config['INV_SERIAL'];
//     var invoice = {
//       generalInvoiceInfo: {
//         invoiceType: '1',
//         templateCode: inv_pattern,
//         transactionUuid: orderNo,
//         invoiceSeries: inv_serial,
//         invoiceIssuedDate: this.dateTimeToMillisecond(invDate),
//         currencyCode: inv_type,
//         adjustmentType: '1', //hoa don goc
//         paymentStatus: true,
//         paymentType: paymentMethod,
//         paymentTypeName: paymentMethod,
//         cusGetInvoiceRight: true,
//         exchangeRate: view_exchange_rate,
//       },
//       buyerInfo: {
//         buyerCode: cusCode,
//         buyerName: cusName,
//         buyerLegalName: cusName,
//         buyerTaxCode: cusTaxCode,
//         buyerAddressLine: cusAddr,
//         buyerPhoneNumber: '',
//         buyerEmail: '',
//         buyerIdNo: '',
//         buyerIdType: '',
//         buyerBankAccount: '',
//         buyerBankName: '',
//       },
//       // "sellerInfo": new stdClass(),
//       extAttribute: [
//         {
//           key: 'reservationCode',
//           value: orderNo,
//         },
//       ],
//       payments: [{ paymentMethodName: paymentMethod }],
//       // "deliveryInfo": [],
//       itemInfo: [],
//       discountItemInfo: [],
//       summarizeInfo: {
//         sumOfTotalLineAmountWithoutTax: sum_amount,
//         totalAmountWithoutTax: sum_amount,
//         totalTaxAmount: vat_amount,
//         totalAmountWithTax: total_amount,
//         totalAmountWithTaxInWords: '',
//         discountAmount: 0,
//         settlementDiscountAmount: 0,
//         taxPercentage: vat_rate,
//       },
//       taxBreakdowns: [],
//       metadata: [
//         {
//           id: 1464,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'quốc tịch',
//           keyTag: 'flag',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['NationID'] || '',
//         },
//         {
//           id: 1465,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'trọng tải',
//           keyTag: 'grossTomage',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: parseFloat(shipInfo['DWT'] || 0) > 0 ? shipInfo['DWT'] : '',
//         },
//         {
//           id: 1466,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Ngày đến',
//           keyTag: 'arrival',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['ATB']
//             ? FunctionModel.moment(shipInfo['ATB']).format('DD/MM/YYYY')
//             : '',
//         },
//         {
//           id: 1467,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Ngày đi',
//           keyTag: 'depature',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['ATD']
//             ? FunctionModel.moment(shipInfo['ATD']).format('DD/MM/YYYY')
//             : '',
//         },
//         {
//           id: 1468,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'nơi đậu',
//           keyTag: 'berth',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['BerthID'] || '',
//         },
//         {
//           id: 1469,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Căn cứ',
//           keyTag: 'basedOn',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: orderNo,
//         },
//         {
//           id: 1470,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Loại hàng',
//           keyTag: 'type',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//         {
//           id: 901,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Tên tàu',
//           keyTag: 'vesselVoyage',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue:
//             shipInfo['VesselName'] +
//             ' ' +
//             shipInfo['InboundVoyage'] +
//             ' / ' +
//             shipInfo['OutboundVoyage'],
//         },
//         {
//           id: 7777,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Tên CN',
//           keyTag: 'branchName',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//         {
//           id: 8888,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Địa chỉ CN',
//           keyTag: 'branchAddress',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//         {
//           id: 9999,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Mã số thuế CN',
//           keyTag: 'branchTaxCode',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//       ],
//     };

//     //neu la hd dieu chinh | thay the: bo sung them thong tin cho generalInvoiceInfo
//     if (adjust_type) {
//       invoice['generalInvoiceInfo']['adjustmentType'] = adjust_type.split('.')[0]; //3 | 5
//       invoice['generalInvoiceInfo']['adjustedNote'] = note;
//       invoice['generalInvoiceInfo']['originalInvoiceId'] = old_invNo;
//       invoice['generalInvoiceInfo']['originalInvoiceIssueDate'] =
//         this.dateTimeToMillisecond(old_invDate);
//       invoice['generalInvoiceInfo']['additionalReferenceDesc'] = 'Văn bản';
//       invoice['generalInvoiceInfo']['additionalReferenceDate'] = this.dateTimeToMillisecond();

//       if (adjust_type == '5') {
//         //neu la hd dieu chinh
//         invoice['generalInvoiceInfo']['adjustmentInvoiceType'] = adjust_inv_type; //doi với loại hd diueu chinh.them thong tin adjustmentInvoiceType (1: dc tien | 2: dc ttin)
//         if (adjust_inv_type === '1' && !isIncreament) {
//           //neu la hd dieu chinh GIAM
//           delete invoice['summarizeInfo']['totalTaxAmount'];
//           delete invoice['summarizeInfo']['totalAmountWithTax'];
//           invoice['summarizeInfo']['isTotalAmountPos'] = false;
//           invoice['summarizeInfo']['isTotalTaxAmountPos'] = false;
//           invoice['summarizeInfo']['isTotalAmtWithoutTaxPos'] = false;
//         }
//       }
//     }

//     var itemInfos = [];
//     var taxBreakdowns = {};
//     //neu không phải là HĐ điều chỉnh thông tin (5.2): thực hiện tính toán cho phần detail
//     if (!(adjust_type == '5' && adjust_inv_type == '2')) {
//       //lam tron so luong+don gia theo yeu cau KT
//       var roundNumQty_Unit = this.config_site['ROUND_NUM_Quantity_UNIT'];
//       for await (let item of datas) {
//         //UNIT_AMT
//         if (typeof item === 'object' && Object.keys(item).length > 0) {
//           var temp = item['TRFDesc'];
//           var unit = await Utils.getUnitName(item['UnitID']);
//           var moreDesc = item['TRFDescMore'] ? String(item['TRFDescMore']).trim() : '';
//           var cntrList = item['Remark'] ? String(item['Remark']).trim() : '';

//           if (cntrList.split(',').length > 5) {
//             //nhieu hon 5cont
//             temp += ' ' + moreDesc.split('||')[0];
//             //lenh nang ha + dong rut : moreDesc = BLNO / BKNO
//             //lenh luu bai + dien lanh : moreDesc = BLNO / BKNO || UETU5196773: 18/02/2022 14:17:09 - 29/03/2022 14:04|TGBU8763621: ....
//           } else if (String(moreDesc).includes('||')) {
//             //it hon 5cont + ccó chuỗi ||.luubai + dien lanh (desc co dang: BLNO/BKNO || .... ....)
//             temp += ` (${moreDesc})`;
//           } else {
//             temp += ' ' + (cntrList || moreDesc); //nguoc lai su dung list cont
//           }

//           //encode content of TRF_DESC because it contain <,> ..
//           var itemName = Common.htmlspecialchars(temp.replace(/(\r\n|\n|\r)/gm, ''));
//           //add info to UNIT CODE
//           var unitName = Common.htmlspecialchars(unit);

//           //them moi lam tron so
//           var urate = parseFloat(item['UnitPrice'].replace(',', ''));
//           var i_amt = parseFloat(item['Amount'].replace(',', ''));

//           var qty = parseFloat(item['Quantity']).toFixed(roundNumQty_Unit); //lam tron so luong+don gia theo yeu cau KT
//           var unitPrice = parseFloat(urate * exchange_rate).toFixed(roundNumQty_Unit); //lam tron so luong+don gia theo yeu cau KT
//           var amount = parseFloat(i_amt * exchange_rate).toFixed(roundNum);
//           var taxPerText = item['VatRate'] ? parseFloat(item['VatRate'].replace(',', '')) : '-2'; //-2 : Hoa dơn KCT
//           var vat_amt = taxPerText == '-2' ? '' : parseFloat(item['VatAmount'].replace(',', ''));
//           var vat = taxPerText == '-2' ? '' : parseFloat(vat_amt * exchange_rate).toFixed(roundNum);
//           var kd = {
//             itemCode: '',
//             itemName: itemName,
//             unitName: unitName,
//             unitPrice: unitPrice,
//             quantity: qty,
//             itemTotalAmountWithoutTax: amount,
//             taxPercentage: taxPerText,
//             taxAmount: vat,
//             discount: 0,
//             itemDiscount: 0,
//           };
//           //xet truong hop 5.1 (dieu chinh tien)
//           if (adjust_type == '5' && isIncreament !== null) {
//             kd['isIncreaseItem'] = isIncreament;
//           }
//           itemInfos.push(kd);

//           if (!taxBreakdowns[taxPerText]) {
//             taxBreakdowns[taxPerText] = {
//               taxPercentage: taxPerText,
//               taxableAmount: amount,
//               taxAmount: vat,
//             };
//           } else {
//             taxBreakdowns[taxPerText]['taxableAmount'] += amount;
//             if (vat) {
//               taxBreakdowns[taxPerText]['taxAmount'] += vat;
//             }
//           }
//         }
//       }

//       if (itemInfos.length == 0) {
//         this.data.success = false;
//         this.data['error'] = 'Kiểm tra lại dữ liệu [detail not null]!';
//         return;
//       }
//     }

//     if (note) {
//       if (adjust_type) {
//         itemInfos.splice(0, 0, {
//           itemName: note,
//           selection: 2,
//         });
//       } else {
//         itemInfos.push({
//           itemName: note,
//           selection: 2,
//         });
//       }
//     }

//     //add prod detail
//     invoice['itemInfo'] = itemInfos;
//     invoice['taxBreakdowns'] = Object.values(taxBreakdowns);

//     if (!this.access_token) {
//       if (!(await this.getToken())) {
//         this.data.success = false;
//         return this.data;
//       }
//     }

//     var path =
//       this.config['API_PATH'] +
//       '/InvoiceUtilsWS/createInvoiceDraftPreview/' +
//       this.config['SUPPLIER_TAX_CODE'];
//     var isSuccess = await this.postToVT(path, JSON.stringify(invoice));
//     if (!isSuccess) {
//       this.data.success = false;
//       return this.data;
//     }

//     var base64File = this.responseData['fileToBytes'];
//     if (!base64File) {
//       this.data.success = false;
//       this.data['error'] = '[VT] Không lấy được file hóa đơn nháp!';
//       return this.data;
//     }

//     this.data['pdfData'] = base64File;
//     return this.data;
//   }

//   //business
//   async adjustInvoice(req) {
//     var args = req.body;
//     var datas = args['datas'] ? args['datas'] : [];
//     var cusTaxCode = args['cusTaxCode'] || '';
//     var cusAddr = args['cusAddr'] ? Common.htmlspecialchars(args['cusAddr']) : '';
//     var cusName = args['cusName'] ? Common.htmlspecialchars(args['cusName']) : '';
//     var inv_type = args['inv_type'] || 'VND';
//     var roundNum = this.config_site['ROUND_NUM'][inv_type]; //ROUND_NUM_Quantity_UNIT

//     var sum_amount = args['sum_amount'] ? parseFloat(args['sum_amount'].replace(',', '')) : '';
//     var vat_amount = args['vat_amount'] ? parseFloat(args['vat_amount'].replace(',', '')) : '';
//     var total_amount = args['total_amount']
//       ? parseFloat(args['total_amount'].replace(',', ''))
//       : '';
//     var exchange_rate = args['exchange_rate']
//       ? parseFloat(args['exchange_rate'].replace(',', ''))
//       : 1;
//     var had_exchange = parseInt(args['had_exchange'] || 0);

//     var currencyInDetails = datas[0]['CurrencyCode'] || 'VND';
//     var paymentMethod = args['paymentMethod'] || 'TM/CK';
//     var shipInfo = args['shipInfo'] || null;
//     var shipKey = args['shipKey'] || '';
//     var vat_rate = datas[0]['VatRate'] ? parseFloat(datas[0]['VatRate'].replace(',', '')) : '';
//     var isCredit = args['isCredit'] || false;

//     var old_pincode = args['old_pincode'] || '';
//     var old_invNo = args['old_invNo'] || '';
//     var old_invDate = args['old_invDate'] || '';
//     var invDate = args['invDate'] || null;
//     var note = args['note'] || '';

//     var adjust_type_text = args['adjust_type'] || ''; //3: THAY THE | 5.1.1: DIEU CHINH TANG TIEN | 5.1.2: DIEU CHINH GIAM TIEN | 5.2: DIEU CHINH TT
//     var adjust_infor = adjust_type_text.split('.');
//     var adjust_type = adjust_infor[0] || '';
//     var adjust_inv_type = adjust_infor[1] || '';
//     var isIncreament = !adjust_infor[2] ? null : adjust_infor[2] == '1';
//     if (!adjust_type) {
//       this.data['error'] = 'Loại điều chỉnh không phù hợp!';
//       this.data.success = false;
//       return this.data;
//     }

//     if (!shipInfo && shipKey) {
//       shipInfo = await this.searchShip(req.gtos, shipKey);
//     }

//     var view_exchange_rate = '';
//     if (exchange_rate != 1) {
//       view_exchange_rate = exchange_rate;
//     }

//     if (inv_type == currencyInDetails || had_exchange === 1) {
//       exchange_rate = 1;
//     }

//     var sum_amount = parseFloat(sum_amount * exchange_rate).toFixed(roundNum);
//     var total_amount = parseFloat(total_amount * exchange_rate).toFixed(roundNum);
//     var vat_amount = parseFloat(vat_amount * exchange_rate).toFixed(roundNum);
//     var amount_in_words = Common.convert_number_to_words(total_amount, inv_type); //doc tien usd
//     amount_in_words = Common.htmlspecialchars(amount_in_words);
//     var orderNo = await OrderModel.generatePinCode(req);
//     var cusCode = String(cusTaxCode).trim();
//     /* checkTaxCode = str_replace('-', "", cusCode);
//         if (!in_array(strlen(checkTaxCode), array(10, 13)) || !is_numeric(checkTaxCode)) {
//             cusTaxCode = "";
//         }*/

//     if (vat_rate === '') {
//       vat_rate = '-2';
//       vat_amount = '';
//     }

//     cusName = cusName.replace(/(\r\n|\n|\r)/gm, '');
//     cusAddr = cusAddr.replace(/(\r\n|\n|\r)/gm, '');

//     var inv_pattern = isCredit ? this.config['INV_CRE']['INV_PATTERN'] : this.config['INV_PATTERN'];
//     var inv_serial = isCredit ? this.config['INV_CRE']['INV_SERIAL'] : this.config['INV_SERIAL'];
//     var invoice = {
//       generalInvoiceInfo: {
//         invoiceType: '1',
//         templateCode: inv_pattern,
//         transactionUuid: orderNo,
//         invoiceSeries: inv_serial,
//         invoiceIssuedDate: this.dateTimeToMillisecond(invDate),
//         currencyCode: inv_type,

//         adjustmentType: adjust_type.split('.')[0], //3 | 5
//         adjustedNote: note,
//         originalInvoiceId: old_invNo,
//         originalInvoiceIssueDate: this.dateTimeToMillisecond(old_invDate),
//         additionalReferenceDesc: 'Văn bản',
//         additionalReferenceDate: this.dateTimeToMillisecond(),

//         paymentStatus: true,
//         paymentType: paymentMethod,
//         paymentTypeName: paymentMethod,
//         cusGetInvoiceRight: true,
//         exchangeRate: view_exchange_rate,
//       },
//       buyerInfo: {
//         buyerCode: cusCode,
//         buyerName: cusName,
//         buyerLegalName: cusName,
//         buyerTaxCode: cusTaxCode,
//         buyerAddressLine: cusAddr,
//         buyerPhoneNumber: '',
//         buyerEmail: '',
//         buyerIdNo: '',
//         buyerIdType: '',
//         buyerBankAccount: '',
//         buyerBankName: '',
//       },
//       // "sellerInfo": new stdClass(),
//       extAttribute: [
//         {
//           key: 'reservationCode',
//           value: orderNo,
//         },
//       ],
//       payments: [
//         {
//           paymentMethodName: paymentMethod,
//         },
//       ],
//       // "deliveryInfo": {},
//       itemInfo: [],
//       discountItemInfo: [],
//       summarizeInfo: {
//         sumOfTotalLineAmountWithoutTax: sum_amount,
//         totalAmountWithoutTax: sum_amount,
//         totalTaxAmount: vat_amount,
//         totalAmountWithTax: total_amount,
//         totalAmountWithTaxInWords: '',
//         discountAmount: 0,
//         settlementDiscountAmount: 0,
//         taxPercentage: vat_rate,
//       },
//       taxBreakdowns: {},
//       metadata: [
//         {
//           id: 1464,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'quốc tịch',
//           keyTag: 'flag',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['NationID'] || '',
//         },
//         {
//           id: 1465,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'trọng tải',
//           keyTag: 'grossTomage',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: parseFloat(shipInfo['DWT']) > 0 ? shipInfo['DWT'] : '',
//         },
//         {
//           id: 1466,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Ngày đến',
//           keyTag: 'arrival',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['ATB']
//             ? FunctionModel.moment(shipInfo['ATB']).format('DD/MM/YYYY')
//             : '',
//         },
//         {
//           id: 1467,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Ngày đi',
//           keyTag: 'depature',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['ATD']
//             ? FunctionModel.moment(shipInfo['ATD']).format('DD/MM/YYYY')
//             : '',
//         },
//         {
//           id: 1468,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'nơi đậu',
//           keyTag: 'berth',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: shipInfo['BerthID'] || '',
//         },
//         {
//           id: 1469,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Căn cứ',
//           keyTag: 'basedOn',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: orderNo,
//         },
//         {
//           id: 1470,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Loại hàng',
//           keyTag: 'type',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//         {
//           id: 901,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Tên tàu',
//           keyTag: 'vesselVoyage',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue:
//             shipInfo['VesselName'] +
//             ' ' +
//             shipInfo['InboundVoyage'] +
//             ' / ' +
//             shipInfo['OutboundVoyage'],
//         },
//         {
//           id: 7777,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Tên CN',
//           keyTag: 'branchName',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//         {
//           id: 8888,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Địa chỉ CN',
//           keyTag: 'branchAddress',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//         {
//           id: 9999,
//           invoiceTemplatePrototypeId: '1602',
//           keyLabel: 'Mã số thuế CN',
//           keyTag: 'branchTaxCode',
//           valueType: 'text',
//           isRequired: false,
//           isSeller: false,
//           stringValue: null,
//         },
//       ],
//     };

//     if (adjust_type == '5') {
//       invoice['generalInvoiceInfo']['adjustmentInvoiceType'] = adjust_inv_type; //doi với loại hd diueu chinh.them thong tin adjustmentInvoiceType (1: dc tien | 2: dc ttin)
//       if (adjust_inv_type === '1' && !isIncreament) {
//         delete invoice['summarizeInfo']['totalTaxAmount'];
//         delete invoice['summarizeInfo']['totalAmountWithTax'];
//         invoice['summarizeInfo']['isTotalAmountPos'] = false;
//         invoice['summarizeInfo']['isTotalTaxAmountPos'] = false;
//         invoice['summarizeInfo']['isTotalAmtWithoutTaxPos'] = false;
//       }
//     }

//     var itemInfos = [];
//     var taxBreakdowns = {};
//     //neu không phải là HĐ điều chỉnh thông tin (5.2): thực hiện tính toán cho phần detail
//     if (!(adjust_type == '5' && adjust_inv_type == '2')) {
//       //lam tron so luong+don gia theo yeu cau KT
//       var roundNumQty_Unit = this.config_site['ROUND_NUM_Quantity_UNIT'];
//       for await (let item of datas) {
//         //UNIT_AMT
//         if (typeof item === 'object' && Object.keys(item).length > 0) {
//           var temp = item['TRFDesc'];
//           var unit = await Utils.getUnitName(item['UnitID']);
//           var moreDesc = String(item['TRFDescMore'] || '').trim();
//           var cntrList = String(item['Remark'] || '').trim();

//           if (cntrList.split(',').length > 5) {
//             //nhieu hon 5cont
//             temp += ' ' + moreDesc.split('||')[0];
//             //lenh nang ha + dong rut : moreDesc = BLNO / BKNO
//             //lenh luu bai + dien lanh : moreDesc = BLNO / BKNO || UETU5196773: 18/02/2022 14:17:09 - 29/03/2022 14:04|TGBU8763621: ....
//           } else if (String(moreDesc).includes('||')) {
//             //it hon 5cont + ccó chuỗi ||.luubai + dien lanh (desc co dang: BLNO/BKNO || .... ....)
//             temp += ` (${moreDesc})`;
//           } else {
//             temp += ' ' + (cntrList || moreDesc); //nguoc lai su dung list cont
//           }

//           //encode content of TRF_DESC because it contain <,> ..
//           var itemName = Common.htmlspecialchars(temp.replace(/(\r\n|\n|\r)/gm, ''));
//           //add info to UNIT CODE
//           var unitName = Common.htmlspecialchars(unit);

//           //them moi lam tron so
//           var urate = parseFloat(item['UnitPrice']);
//           var i_amt = parseFloat(item['Amount']);

//           var qty = parseFloat(item['Quantity']).toFixed(roundNumQty_Unit); //lam tron so luong+don gia theo yeu cau KT
//           var unitPrice = parseFloat(urate * exchange_rate).toFixed(roundNumQty_Unit); //lam tron so luong+don gia theo yeu cau KT
//           var amount = parseFloat(i_amt * exchange_rate).toFixed(roundNum);
//           var taxPerText = item['VatRate'] ? parseFloat(item['VatRate']) : '-2'; //-2 : Hoa dơn KCT
//           var vat_amt = taxPerText == '-2' ? '' : parseFloat(item['VatAmount']);
//           var vat = taxPerText == '-2' ? '' : parseFloat(vat_amt * exchange_rate).toFixed(roundNum);
//           var kd = {
//             itemCode: '',
//             itemName: itemName,
//             unitName: unitName,
//             unitPrice: unitPrice,
//             quantity: qty,
//             itemTotalAmountWithoutTax: amount,
//             taxPercentage: taxPerText,
//             taxAmount: vat,
//             discount: 0,
//             itemDiscount: 0,
//           };
//           //xet truong hop 5.1 (dieu chinh tien)
//           if (adjust_type == '5' && isIncreament !== null) {
//             kd['isIncreaseItem'] = isIncreament;
//           }
//           itemInfos.push(kd);

//           if (!taxBreakdowns[taxPerText]) {
//             taxBreakdowns[taxPerText] = {
//               taxPercentage: taxPerText,
//               taxableAmount: amount,
//               taxAmount: vat,
//             };
//           } else {
//             taxBreakdowns[taxPerText]['taxableAmount'] += amount;
//             if (vat) {
//               taxBreakdowns[taxPerText]['taxAmount'] += vat;
//             }
//           }
//         }
//       }

//       if (itemInfos.length == 0) {
//         this.data.success = false;
//         this.data['error'] = 'Kiểm tra lại dữ liệu [detail not null]!';
//         return this.data;
//       }
//     }

//     if (adjust_type == '5' && note) {
//       itemInfos.splice(0, 0, {
//         itemName: note,
//         selection: 2,
//       });
//     }

//     //add prod detail
//     invoice['itemInfo'] = itemInfos;
//     invoice['taxBreakdowns'] = Object.values(taxBreakdowns);

//     if (!this.access_token) {
//       if (!(await this.getToken())) {
//         this.data.success = false;
//         return this.data;
//       }
//     }

//     var path =
//       this.config['API_PATH'] + '/InvoiceWS/createInvoice/' + this.config['SUPPLIER_TAX_CODE'];
//     var isSuccess = await this.postToVT(path, JSON.stringify(invoice));
//     if (!isSuccess) {
//       this.data.success = false;
//       return this.data;
//     }

//     var result = this.responseData['result'];

//     this.data['pattern'] = invoice['generalInvoiceInfo']['templateCode']; //invoiceSeries
//     this.data['serial'] = invoice['generalInvoiceInfo']['invoiceSeries'];
//     this.data['fkey'] = orderNo;
//     this.data['inv'] = result['invoiceNo'];
//     this.data['invno'] = result['invoiceNo'].replace(
//       invoice['generalInvoiceInfo']['invoiceSeries'],
//       '',
//     );
//     this.data['hddt'] = 1; //them moi hd thu sau
//     this.data['reservationCode'] = result['reservationCode'];
//     this.data['InvDate'] = FunctionModel.moment
//       .unix(invoice['generalInvoiceInfo']['invoiceIssuedDate'] / 1000)
//       .format('YYYY-MM-DD HH:mm:ss');
//     return this.data;
//   }

//   async cancelInv(req) {
//     var args = req.body;
//     var fkey = args['fkey'] || '';
//     var inv = args['inv'] || '';
//     var invType = args['invType'] || '';
//     var issueDate = args['issueDate'] || '';
//     var cancelReason = args['cancelReason'] || '';

//     if (!this.access_token) {
//       if (!(await this.getToken())) {
//         this.data.success = false;
//         return this.data;
//       }
//     }

//     if (fkey && !inv) {
//       var temp = await req
//         .gtos('INV_INVOICE')
//         .select('InvNo', 'InvDate', 'PayFormID')
//         .where('orderNo', fkey)
//         .limit(1)
//         .order_by('InvDate', 'DESC')
//         .catch(err => console.log(err));
//       if (!temp) {
//         this.data.success = false;
//         this.data['error'] = 'Không tìm thấy dữ liệu hóa đơn theo Mã PIN';
//         return this.data;
//       }

//       inv = temp[0]['InvNo'];
//       issueDate = temp[0]['InvDate'];
//       invType = temp[0]['PayFormID'];
//     }

//     var pattern =
//       invType == 'CRE' ? this.config['INV_CRE']['INV_PATTERN'] : this.config['INV_PATTERN'];
//     var path = this.config['API_PATH'] + '/InvoiceWS/cancelTransactionInvoice';
//     var inputData = {
//       supplierTaxCode: this.config['SUPPLIER_TAX_CODE'],
//       templateCode: pattern,
//       invoiceNo: inv,
//       strIssueDate: this.dateTimeToMillisecond(issueDate),
//       additionalReferenceDesc: cancelReason,
//       additionalReferenceDate: this.dateTimeToMillisecond(),
//       reasonDelete: cancelReason,
//     };
//     var qs = require('querystring');
//     var params1 = qs.stringify(inputData);
//     var params = new URLSearchParams(inputData).toString();
//     var isSuccess = await this.postToVT(path, params, {
//       contentType: 'application/x-www-form-urlencoded',
//     });
//     if (!isSuccess) {
//       this.data.success = false;
//       return this.data;
//     }

//     this.data.success = true;
//     return this.data;
//   }
// }
// export default InvoiceManagementVT;
