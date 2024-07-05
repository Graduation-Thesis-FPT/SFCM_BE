import { Base } from './base.model';

export interface JobQuantityCheck extends Base {
  ROWGUID: string;
  PACKAGE_ID?: string;
  ESTIMATED_CARGO_PIECE?: number;
  ACTUAL_CARGO_PIECE?: number;
  SEQ?: number;
  START_DATE?: Date;
  FINISH_DATE?: Date;
  JOB_STATUS?: string;
}

export interface JobQuantityCheckList {
  insert: JobQuantityCheck[];
  update: JobQuantityCheck[];
}
