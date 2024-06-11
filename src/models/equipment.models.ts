export interface Equipment {
  EQU_CODE: string;
  EQU_TYPE: string;
  EQU_CODE_NAME: string;
  BLOCK_CODE: string;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}

export interface EquipmentListInfo {
  insert: Equipment[];
  update: Equipment[];
}
