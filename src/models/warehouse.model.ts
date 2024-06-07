export interface WareHouse {
  WAREHOUSE_CODE: string;
  WAREHOUSE_NAME: string;
  ACREAGE: number;
  STATUS : boolean;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}
export interface WareHouseInfo {
  insert: WareHouse[];
  update: WareHouse[];
}
