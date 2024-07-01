import { Base } from './base.model';

export interface Tariff extends Base {
  ROWGUID: string;
  TRF_CODE: string;
  TRF_DESC: string;
  METHOD_CODE: string;
  ITEM_TYPE_CODE: string;
  AMT_CBM: number;
  VAT: number;
  INCLUDE_VAT: boolean;
  TRF_TEMP_CODE: string;
}

export interface TariffList {
  insert: Tariff[];
  update: Tariff[];
}
