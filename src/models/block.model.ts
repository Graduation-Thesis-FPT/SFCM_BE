export interface Block {
  BLOCK_CODE: string;
  WAREHOUSE_CODE: string;
  BLOCK_NAME: string;
  TIER_COUNT: number;
  SLOT_COUNT: number;
  BLOCK_WIDTH: number;
  BLOCK_LENGTH: number;
  BLOCK_HEIGHT: number;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}

export interface BlockListInfo {
  insert: Block[];
  update: Block[];
}
