export interface Method {
  METHOD_CODE: string;
  METHOD_NAME: string;
  IS_IN_OUT: string;
  IS_SERVICE: boolean;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}
export interface MethodInfoList {
  insert: Method[];
  update: Method[];
}
