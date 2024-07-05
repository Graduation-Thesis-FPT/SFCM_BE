import { Base } from './base.model';

export interface DeliverOrder extends Base {
  DE_ORDER_NO: string;
  CUSTOMER_CODE: string;
  CONTAINER_ID?: string;
  PACKAGE_ID?: string;
  INV_ID?: string;
  INV_DRAFT_ID?: string;
  ISSUE_DATE: Date;
  EXP_DATE: Date;
  TOTAL_CBM?: number;
  JOB_CHK?: boolean;
  NOTE?: string;
}

export interface DeliverOrderList {
  insert: DeliverOrder[];
  update: DeliverOrder[];
}
