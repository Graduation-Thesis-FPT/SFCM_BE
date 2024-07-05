export interface Cell {
  ROWGUID?: string;
  // WAREHOUSE_CODE: string;
  BLOCK_CODE: string;
  TIER_ORDERED: number;
  SLOT_ORDERED: number;
  STATUS: number;
  CELL_LENGTH: number;
  CELL_WIDTH: number;
  CELL_HEIGHT: number;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}
