import { Base } from './base.model';

export interface DiscountTariff extends Base {
  ROWGUID: string;
  ITEM_TYPE_CODE: string;
  METHOD_CODE: string;
  CUSTOMER_CODE: string;
  TRF_TEMP_CODE: string;
  TRF_CODE: string;
  TRF_DESC: string;
  AMT_CBM: number;
  VAT: number;
  INCLUDE_VAT: boolean;
}

export interface DiscountTariffList {
  insert: DiscountTariff[];
  update: DiscountTariff[];
}
