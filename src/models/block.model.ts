export interface Block {
  WAREHOUSE_CODE: string;
  BLOCK_NAME: string;
  TIER_COUNT: number;
  SLOT_COUNT: number;
  BLOCK_WIDTH: number;
  BLOCK_HEIGHT: number;
  STATUS?: boolean;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}
