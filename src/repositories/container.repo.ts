import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { Equipment as EquipmentEntity } from '../entity/equipment.entity';
import { Container } from '../models/container.model';
import { ContainerEntity } from '../entity/container.entity';

export const containerRepository = mssqlConnection.getRepository(ContainerEntity);

const createContainer = async (
  containerListInfo: Container[],
  transactionEntityManager: EntityManager,
) => {
  const container = containerRepository.create(containerListInfo);

  const newContainer = await transactionEntityManager.save(container);
  return newContainer;
};

const findOneEquipment = async (equimentCode: string, transactionEntityManager: EntityManager) => {
  return await transactionEntityManager
    .createQueryBuilder(EquipmentEntity, 'equipment')
    .where('equipment.EQU_CODE = :equimentCode', { equimentCode: equimentCode })
    .getOne();
};

const updateContainer = async (
  containerListInfo: Container[],
  transactionEntityManager: EntityManager,
) => {
  return await Promise.all(
    containerListInfo.map(container =>
      transactionEntityManager.update(ContainerEntity, container.ROWGUID, container),
    ),
  );
};

const findContainerByRowid = async (
  containerCode: string,
  transactionEntityManager: EntityManager,
) => {
  return await transactionEntityManager
    .createQueryBuilder(ContainerEntity, 'container')
    .where('container.ROWGUID = :containerCode', { containerCode: containerCode })
    .getOne();
};

const findContainer = async (containerRowId: string) => {
  return await containerRepository
    .createQueryBuilder('container')
    .where('container.ROWGUID = :containerRowId', { containerRowId: containerRowId })
    .getOne();
};

const deleteContainerMany = async (containerCode: string[]) => {
  return await containerRepository.delete(containerCode);
};

const filterContainer = async (rule: any) => {
  const filterObj = rule;
  return await containerRepository.find({
    where: filterObj,
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const isUniqueContainer = async (
  voyagekey: string,
  cntrno: string,
  transactionEntityManager: EntityManager,
) => {
  return await transactionEntityManager
    .createQueryBuilder(ContainerEntity, 'container')
    .where('container.VOYAGEKEY = :voyagekey', { voyagekey: voyagekey })
    .andWhere('container.CNTRNO = :cntrno', { cntrno: cntrno })
    .getOne();
};

export {
  createContainer,
  findOneEquipment,
  updateContainer,
  findContainerByRowid,
  filterContainer,
  deleteContainerMany,
  findContainer,
  isUniqueContainer,
};
