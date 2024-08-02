import { Base } from './base.model';

export interface InvVatDtl extends Base {
  ROWGUID?: string;
  INV_ID: string;
  QTY: number;
  UNIT_RATE: number;
  AMOUNT: number;
  VAT: number;
  VAT_RATE: number;
  TAMOUNT: number;
  CARGO_TYPE: string;
  TRF_DESC: string;
}

export type PaymentDtl = {
  QTY: number;
  UNIT_RATE: number;
  AMOUNT: number;
  VAT: number;
  VAT_RATE: number;
  TAMOUNT: number;
  CARGO_TYPE: string;
  TRF_DESC: string;
};
