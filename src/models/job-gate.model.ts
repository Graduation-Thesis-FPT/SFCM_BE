import { Base } from './base.model';

export interface JobGate extends Base {
  ROWGUID: string;
  ORDER_NO: string;
  WAREHOUSE_CODE: string;
  GATE_CODE: string;
  IS_IN_OUT: string;
  DRIVER: string;
  TEL: string;
  TRUCK_NO: string;
  WEIGHT_REGIS: number;
  WEIGHT_REGIS_ALLOW: number;
  HOUSE_BILL: string;
  CARGO_PIECE: number;
  UNIT_CODE: string;
  NOTE: string;
  TIME_IN: Date;
  TIME_OUT: Date;
  IS_SUCCESS_IN: boolean;
  IS_SUCCESS_OUT: boolean;
}
