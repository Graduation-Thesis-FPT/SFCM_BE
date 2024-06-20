import { Base } from './base.model';

export interface TariffCode extends Base {
  TRF_CODE: string;
  TRF_DESC: string;
}

export interface TariffCodeList {
  insert: TariffCode[];
  update: TariffCode[];
}
