import mssqlConnection from '../db/mssql.connect';
import { EquipmentType as EquipmentTypeEntity } from '../entity/equipment-type.entity';
// import { EquipType as EquipTypeEntity } from '../entity/equipment-type.entity';
import { EquipmentType } from '../models/equipment-type.model';

export const equipTypeRepository = mssqlConnection.getRepository(EquipmentTypeEntity);

const isDuplicateEquipType = async (equtName: string) => {
  return await equipTypeRepository
    .createQueryBuilder('equt')
    .where('equt.EQU_TYPE_NAME = :equtName', { equtName: equtName })
    .getOne();
};

const createEquipType = async (equipTypeListInfo: EquipmentType[]) => {
  const gate = equipTypeRepository.create(equipTypeListInfo);

  const newGate = await equipTypeRepository.save(gate);
  return newGate;
};

const updateEquipType = async (equipTypeListInfo: EquipmentType[]) => {
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
