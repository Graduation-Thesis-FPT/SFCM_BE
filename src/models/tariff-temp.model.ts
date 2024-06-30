import { Base } from './base.model';

export interface TariffTemp extends Base {
  TRF_TEMP_CODE: string;
  TRF_TEMP_NAME: string;
  FROM_DATE: Date;
  TO_DATE: Date;
}

export interface TariffTempList {
  insert: TariffTemp[];
  update: TariffTemp[];
}
