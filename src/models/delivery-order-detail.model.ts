import { Base } from './base.model';

export interface DeliverOrderDetail extends Base {
  ROWGUID?: string;
  DE_ORDER_NO?: string;
  METHOD_CODE: string;
  HOUSE_BILL: string;
  CBM: number;
  LOT_NO: number;
  REF_PAKAGE: string;
}
