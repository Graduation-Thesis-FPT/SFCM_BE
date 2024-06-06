export interface Gate {
  ROWGUID?: string;
  GATE_CODE: string;
  GATE_NAME: string;
  IS_IN_OUT: string;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}

export interface GateListInfo {
  insert: Gate[];
  update: Gate[];
}
