import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { Equipment as EquipmentEntity } from '../entity/equipment.entity';
import { Equipment } from '../models/equipment.models';

export const equipmentRepository = mssqlConnection.getRepository(EquipmentEntity);

const createEquipment = async (
  equipmentListInfo: Equipment[],
  transactionEntityManager: EntityManager,
) => {
  const equipment = equipmentRepository.create(equipmentListInfo);

  const newEquipment = await transactionEntityManager.save(equipment);
  return newEquipment;
};

const findOneEquipment = async (equimentCode: string, transactionEntityManager: EntityManager) => {
  return await transactionEntityManager
    .createQueryBuilder(EquipmentEntity, 'equipment')
    .where('equipment.EQU_CODE = :equimentCode', { equimentCode: equimentCode })
    .getOne();
};

const updateEquipment = async (
  equipmentListInfo: Equipment[],
  transactionEntityManager: EntityManager,
) => {
  return await Promise.all(
    equipmentListInfo.map(equipment =>
      transactionEntityManager.update(EquipmentEntity, equipment.EQU_CODE, equipment),
    ),
  );
};

const findEquipmentByCode = async (
  equipmentCode: string,
  transactionEntityManager: EntityManager,
) => {
  return await transactionEntityManager
    .createQueryBuilder(EquipmentEntity, 'equt')
    .where('equt.EQU_CODE = :equipmentCode', { equipmentCode: equipmentCode })
    .getOne();
};

const findEquipment = async (equipmentCode: string) => {
  return await equipmentRepository
    .createQueryBuilder('equt')
    .where('equt.EQU_CODE = :equipmentCode', { equipmentCode: equipmentCode })
    .getOne();
};

const deleteEquipmentMany = async (equtCode: string[]) => {
  return await equipmentRepository.delete(equtCode);
};

const getAllEquipment = async () => {
  return await equipmentRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

export {
  createEquipment,
  findOneEquipment,
  updateEquipment,
  findEquipmentByCode,
  getAllEquipment,
  deleteEquipmentMany,
  findEquipment,
};
