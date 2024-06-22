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
  FROM_DATE: Date;
  TO_DATE: Date;
  TRF_NAME: string;
  TRF_TEMP: string;
}

export interface TariffList {
  insert: Tariff[];
  update: Tariff[];
}
