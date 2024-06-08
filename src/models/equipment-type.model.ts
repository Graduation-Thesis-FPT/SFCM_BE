export interface EquipmentType {
  EQU_TYPE: string;
  EQU_TYPE_NAME: string;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}

export interface EquipmentTypeListInfo {
  insert: EquipmentType[];
  update: EquipmentType[];
}
