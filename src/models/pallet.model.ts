import { User } from '../entity/user.entity';

export interface PalletReq {
  CELL_ID: string;
  PALLET_NO: string;
  WAREHOUSE_CODE: string;
  CREATE_BY: User;
}

export interface Pallet {
  PALLET_LENGTH?: number;
  PALLET_WIDTH?: number;
  PALLET_HEIGHT?: number;
}
