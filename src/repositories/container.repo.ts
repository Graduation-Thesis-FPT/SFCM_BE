import { EntityManager } from 'typeorm';
import mssqlConnection from '../dbs/mssql.connect';
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
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager
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
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager
    .createQueryBuilder(ContainerEntity, 'container')
    .leftJoin('DT_VESSEL_VISIT', 'sp', 'sm.VOYAGEKEY = sp.VOYAGEKEY')
    .where('container.VOYAGEKEY = :voyagekey', { voyagekey: voyagekey })
    .andWhere('container.CNTRNO = :cntrno', { cntrno: cntrno })
    .getOne();
};

const isDuplicateContainer = async (
  voyageKey: string,
  cntrNo: string,
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager
    .createQueryBuilder(ContainerEntity, 'container')
    .select('container.VOYAGEKEY', 'VOYAGEKEY')
    .addSelect('container.CNTRNO', 'CNTRNO')
    .leftJoin('DT_VESSEL_VISIT', 'vesselVisit', 'container.VOYAGEKEY = vesselVisit.VOYAGEKEY')
    .addSelect('vesselVisit.VESSEL_NAME', 'VESSEL_NAME')
    .addSelect('vesselVisit.ETA', 'ETA')
    .where('container.VOYAGEKEY = :voyageKey', { voyageKey })
    .andWhere('container.CNTRNO = :cntrNo', { cntrNo })
    .getRawOne();
};

const isContainerExecuted = async (containerId: string) => {
  const container = await containerRepository
    .createQueryBuilder('cn')
    .innerJoin('DELIVER_ORDER', 'do', 'cn.ROWGUID = do.CONTAINER_ID')
    .where('cn.ROWGUID = :containerId', { containerId })
    .select([
      'cn.ROWGUID as ROWGUID',
      'do.DE_ORDER_NO as DE_ORDER_NO',
      'do.CONTAINER_ID as CONTAINER_ID',
    ])
    .getRawOne();

  return container;
};

export {
  createContainer,
  updateContainer,
  findContainerByRowid,
  filterContainer,
  deleteContainerMany,
  findContainer,
  isUniqueContainer,
  isDuplicateContainer,
  isContainerExecuted,
};
