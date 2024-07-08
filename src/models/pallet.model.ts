import { User } from '../entity/user.entity';

export interface PalletReq {
  CELL_ID: string;
  PALLET_NO: string;
  WAREHOUSE_CODE: string;
  CREATE_BY: User;
}
