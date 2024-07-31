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

export interface ExtendedDeliverOrderDetail extends DeliverOrderDetail {
  PACKAGE_UNIT_CODE: string;
  ITEM_TYPE_CODE: string;
  CONTAINER_ID: string;
  PK_DECLARE_NO: string | null;
  PK_CARGO_PIECE: number;
  PK_NOTE: string;
}
