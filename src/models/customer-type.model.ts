export interface CustomerType {
  CUSTOMER_TYPE_CODE: string;
  CUSTOMER_TYPE_NAME: string;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}

export interface CustomerTypeList {
  insert: CustomerType[];
  update: CustomerType[];
}
