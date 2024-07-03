export interface PackageUnit {
  PACKAGE_UNIT_CODE: string;
  PACKAGE_UNIT_NAME: string;
  CREATE_BY?: string;
  CREATE_DATE?: Date;
  UPDATE_BY?: string;
  UPDATE_DATE?: Date;
}
export interface PackageUnitInfo {
  insert: PackageUnit[];
  update: PackageUnit[];
}
