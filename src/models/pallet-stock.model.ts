import { Base } from './base.model';

export interface PalletModel extends Base {
  PALLET_NO: string;
  JOB_QUANTITY_ID: string;
  CELL_ID?: string;
  PALLET_STATUS?: string;
  PALLET_LENGTH?: number;
  PALLET_WIDTH?: number;
  PALLET_HEIGHT?: number;
  NOTE?: string;
}

export interface PalletModelList {
  insert: PalletModel[];
  update: PalletModel[];
}
