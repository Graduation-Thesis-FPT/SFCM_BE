import moment from 'moment';
import mssqlConnection from '../db/mssql.connect';
import { InvNoEntity } from '../entity/inv_vat.entity';

const invVatReporsitory = mssqlConnection.getRepository(InvNoEntity);
export type whereRevenue = {
  fromDate: Date;
  toDate: Date;
  isInEx: '' | 'I' | 'E';
  INV_NO?: string;
  PAYER?: string;
};

const getReportRevenue = async (whereObj: whereRevenue) => {
  let results = invVatReporsitory
    .createQueryBuilder('iv')
    .leftJoin('DELIVER_ORDER', 'dl', 'iv.INV_NO = dl.INV_ID')
    .select([
      'dl.DE_ORDER_NO as DE_ORDER_NO',
      'iv.INV_NO as INV_NO',
      'iv.AMOUNT as AMOUNT',
      'iv.VAT as VAT',
      'iv.TAMOUNT as TAMOUNT',
      'iv.INV_DATE as INV_DATE',
      'iv.PAYER as PAYER',
    ])
    .where('iv.INV_DATE >= :fromDate', { fromDate: whereObj.fromDate })
    .andWhere('iv.INV_DATE <= :toDate', { toDate: whereObj.toDate })
    .andWhere('iv.PAYMENT_STATUS = :payment', { payment: 'Y' });
  if (whereObj.INV_NO) {
    results = results.andWhere('iv.INV_NO = :invNo', { invNo: whereObj.INV_NO });
  }
  if (whereObj.PAYER) {
    results = results.andWhere('iv.PAYER = :payer', { payer: whereObj.PAYER });
  }
  let temp = await results.getRawMany();
  if (whereObj.isInEx) {
    if (whereObj.isInEx == 'I') {
      temp = temp.filter(item => item.DE_ORDER_NO.includes('NK'));
    } else {
      temp = temp.filter(item => item.DE_ORDER_NO.includes('Xk'));
    }
  }
  return temp;
};

export { getReportRevenue };
