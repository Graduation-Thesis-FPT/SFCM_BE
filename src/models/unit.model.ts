export interface Unit {
    UNIT_CODE: string;
    UNIT_NAME: string;
    CREATE_BY?: string;
    CREATE_DATE?: Date;
    UPDATE_BY?: string;
    UPDATE_DATE?: Date;
  }
  export interface UnitInfo {
    insert: Unit[];
    update: Unit[];
  }
  