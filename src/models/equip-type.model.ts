export interface EquipType {
  EQU_TYPE: string;
  EQU_TYPE_NAME: string;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}

export interface EquipTypeListInfo {
  insert: EquipType[];
  update: EquipType[];
}
