import mssqlConnection from '../db/mssql.connect';
import { PackageUnit as PackageUnitEntity } from '../entity/packge-unit.entity';
import { PackageUnit } from '../models/package-unit.model';

export const PackageUnitRepository = mssqlConnection.getRepository(PackageUnitEntity);

export const getPackageUnit = async () => {
  return await PackageUnitRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

export const deletePackageUnit = async (PackageUnitListId: string[]) => {
  return await PackageUnitRepository.delete(PackageUnitListId);
};

export const findPackageUnitByCode = async (PACKAGE_UNIT_CODE: string) => {
  return await PackageUnitRepository.createQueryBuilder('item')
    .where('item.PACKAGE_UNIT_CODE = :PACKAGE_UNIT_CODE', { PACKAGE_UNIT_CODE: PACKAGE_UNIT_CODE })
    .getOne();
};

export const createPackageUnit = async (PackageUnitList: PackageUnit[]) => {
  const newUnit = await PackageUnitRepository.save(PackageUnitList);
  return newUnit;
};

export const updatePackageUnit = async (PackageUnitList: PackageUnit[]) => {
  for await (const data of PackageUnitList) {
    await PackageUnitRepository.update({ PACKAGE_UNIT_CODE: data.PACKAGE_UNIT_CODE }, data);
  }
  return true;
};
