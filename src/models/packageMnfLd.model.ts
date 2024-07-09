import { Base } from './base.model';

export interface Package extends Base {
  ROWGUID?: string;
  HOUSE_BILL: string;
  ITEM_TYPE_CODE: string;
  PACKAGE_UNIT_CODE: string;
  CARGO_PIECE: number;
  CBM: number;
  DECLARE_NO: string;
  CONTAINER_ID: string;
  NOTE: string;
}

export interface PackageInfo {
  insert: Package[];
  update: Package[];
}
