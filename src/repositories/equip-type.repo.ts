import mssqlConnection from '../db/mssql.connect';
import { EquipType as EquipTypeEntity } from '../entity/equip-type.entity';
import { EquipType } from '../models/equip-type.model';

export const equipTypeRepository = mssqlConnection.getRepository(EquipTypeEntity);

const isDuplicateEquipType = async (equtName: string) => {
  return await equipTypeRepository
    .createQueryBuilder('equt')
    .where('equt.EQU_TYPE_NAME = :equtName', { equtName: equtName })
    .getOne();
};

const createEquipType = async (equipTypeListInfo: EquipType[]) => {
  const gate = equipTypeRepository.create(equipTypeListInfo);

  const newGate = await equipTypeRepository.save(gate);
  return newGate;
};

const updateEquipType = async (equipTypeListInfo: EquipType[]) => {
  return await Promise.all(
    equipTypeListInfo.map(equipType => equipTypeRepository.update(equipType.EQU_TYPE, equipType)),
  );
};

const findEquipTypeByCode = async (equtCode: string) => {
  return await equipTypeRepository
    .createQueryBuilder('equt')
    .where('equt.EQU_TYPE = :equtCode', { equtCode: equtCode })
    .getOne();
};

const deleteEquipTypeMany = async (equtCode: string[]) => {
  return await equipTypeRepository.delete(equtCode);
};

const getAllEquipType = async () => {
  return await equipTypeRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

export {
  isDuplicateEquipType,
  createEquipType,
  updateEquipType,
  findEquipTypeByCode,
  deleteEquipTypeMany,
  getAllEquipType,
};
