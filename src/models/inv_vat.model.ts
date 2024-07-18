import { Base } from './base.model';

export interface InvVat extends Base {
  INV_NO: string;
  INV_DATE?: Date;
  PAYER: string;
  AMOUNT: number;
  VAT: number;
  TAMOUNT: number;
  PAYMENT_STATUS: string;
  ACC_CD: string;
  CANCEL_DATE?: string;
  CANCLE_REMARK?: string;
  CANCLE_BY?: string;
}
export type Payment = {
  INV_NO: string;
  ACC_CD: string;
  INV_DATE: Date;
  AMOUNT: number;
  VAT: number;
  TAMOUNT: number;
  PAYMENT_STATUS: string;
  CANCEL_DATE?: string;
  CANCLE_REMARK?: string;
  CANCLE_BY?: string;
};
