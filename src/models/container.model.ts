import { Base } from './base.model';

export interface Container extends Base {
  ROWGUID: string;
  VOYAGEKEY: string;
  BILLOFLADING: string;
  SEALNO: string;
  CNTRNO: string;
  CNTRSZTP: string;
  STATUSOFGOOD: boolean;
  ITEM_TYPE_CODE: string;
  COMMODITYDESCRIPTION: string;
  CONSIGNEE: string;
}

export interface ContainerList {
  insert: Container[];
  update: Container[];
}
