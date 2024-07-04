import { Base } from './base.model';

export interface Order extends Base {
  ORDER_NO: string;
  CUSTOMER_CODE: string;
  BILLOFLADING: string;
  REF_CONTAINER: string;
  ITEM_TYPE_CODE: string;
  ITEM_TYPE_CODE_CNTR: number;
  METHOD_CODE: string;
  ISSUE_DATE: Date;
  EXP_DATE: Date;
  TOTAL_CBM: number;
  NOTE: string;
  DRAFT_NO: string;
  INV_NO: string;
  JOB_CHK: boolean;
  COMMODITYDESCRIPTION: string;
}
