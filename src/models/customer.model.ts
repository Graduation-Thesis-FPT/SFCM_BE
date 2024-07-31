export interface Customer {
  CUSTOMER_CODE: string;
  CUSTOMER_NAME: string;
  CUSTOMER_TYPE_CODE: string;
  USER_NAME: string;
  ADDRESS: string;
  TAX_CODE: string;
  EMAIL: string;
  IS_ACTIVE: boolean;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}

export interface CustomerList {
  insert: Customer[];
  update: Customer[];
}
