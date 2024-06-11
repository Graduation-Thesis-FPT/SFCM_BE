import mssqlConnection from '../db/mssql.connect';
import { UnitType as UnitTypeEntity } from '../entity/unit.entity';
import { Unit } from '../models/unit.model';

export const UnitRepository = mssqlConnection.getRepository(UnitTypeEntity);

const getUnit = async () => {
  return await UnitRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const deleteUnit = async (UnitListId: string[]) => {
  return await UnitRepository.delete(UnitListId);
};

const findUnitByCode = async (UNIT_CODE: string) => {
  return await UnitRepository
    .createQueryBuilder('item')
    .where('item.UNIT_CODE = :UNIT_CODE', { UNIT_CODE: UNIT_CODE })
    .getOne();
};

const createUnit = async (UnitList: Unit[]) => {
  const newUnit = await UnitRepository.save(UnitList);
  return newUnit;
};

const updateUnit = async (UnitList: Unit[]) => {
  for await (const data of UnitList) {
    await UnitRepository.update({ UNIT_CODE: data.UNIT_CODE }, data);
  }
  return true;
};

export { getUnit, deleteUnit, findUnitByCode, createUnit, updateUnit };
