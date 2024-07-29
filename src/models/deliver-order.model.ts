import { StringSchema } from 'joi';
import { Base } from './base.model';

export interface DeliverOrder extends Base {
  DE_ORDER_NO?: string;
  CUSTOMER_CODE?: string;
  CONTAINER_ID?: string;
  PACKAGE_ID?: string;
  INV_ID?: string;
  INV_DRAFT_ID?: string;
  ISSUE_DATE?: Date;
  EXP_DATE?: Date;
  TOTAL_CBM?: number;
  JOB_CHK?: boolean;
  NOTE?: string;
}

export interface DeliverOrderList {
  insert: DeliverOrder[];
  update: DeliverOrder[];
}

export interface OrderReqIn extends Base {
  DE_ORDER_NO?: string;
  ROWGUID: string;
  CONTAINER_ID: string;
  PACKAGE_ID?: string;
  CUSTOMER_CODE: string;
  EXP_DATE: Date;
  HOUSE_BILL: string;
  CBM: number;
  INV_DRAFT_ID: string;
}

export type whereExManifest = {
  VOYAGEKEY: string;
  CONTAINER_ID: string;
  HOUSE_BILL: string;
};

export enum OrderType {
  import = 'import',
  export = 'export',
  undefined = 'undefined',
}

export enum ImportedOrderStatus {
  isConfirmed = 'isConfirmed',
  isChecked = 'isChecked',
  isStored = 'isStored',
}

export interface ImportedOrder extends DeliverOrder {
  status: ImportedOrderStatus;
}

export enum ExportedOrderStatus {
  isConfirmed = 'isConfirmed',
  isReleased = 'isReleased',
}

export interface ExportedOrder extends DeliverOrder {
  status: ExportedOrderStatus;
}
