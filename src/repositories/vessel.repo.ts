import { Between, EntityManager } from 'typeorm';
import mssqlConnection from '../dbs/mssql.connect';
import { Vessel as VesselEntity } from '../entity/vessel.entity';
import { ContainerEntity } from '../entity/container.entity';
import { Vessel } from '../models/vessel.model';

export const vesselRepository = mssqlConnection.getRepository(VesselEntity);
const containerReposiory = mssqlConnection.getRepository(ContainerEntity);

const createVessel = async (
  vesselListInfo: Vessel[],
  transactionalEntityManager: EntityManager,
) => {
  const vessel = vesselRepository.create(vesselListInfo);

  const newVessel = await transactionalEntityManager.save(vessel);
  return newVessel;
};

const updateVessel = async (
  vesselListInfo: Vessel[],
  transactionalEntityManager: EntityManager,
) => {
  return await Promise.all(
    vesselListInfo.map(vessel =>
      transactionalEntityManager.update(VesselEntity, vessel.VOYAGEKEY, vessel),
    ),
  );
};

const findVesselByCode = async (vesselCode: string, transactionalEntityManager: EntityManager) => {
  return await transactionalEntityManager
    .createQueryBuilder(VesselEntity, 'vessel')
    .where('vessel.VOYAGEKEY = :vesselCode', { vesselCode: vesselCode })
    .getOne();
};

const findVessel = async (vesselCode: string) => {
  return await vesselRepository
    .createQueryBuilder('vessel')
    .where('vessel.VOYAGEKEY = :vesselCode', {
      vesselCode: vesselCode,
    })
    .getOne();
};

const deleteVesselMany = async (vesselCode: string[]) => {
  return await vesselRepository.delete(vesselCode);
};

const getAllVessel = async (rule: { fromDate: Date; toDate: Date }) => {
  let filterObj = {};
  if (rule?.fromDate && rule?.toDate) filterObj = { ETA: Between(rule?.fromDate, rule?.toDate) };
  return await vesselRepository.find({
    where: filterObj,
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const findVesselInBoundVoyage = async (
  vesselInboundVoyage: string,
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager
    .createQueryBuilder(VesselEntity, 'vessel')
    .where('vessel.INBOUND_VOYAGE = :vesselInboundVoyage', { vesselInboundVoyage })
    .getOne();
};

const findContainerByVoyageKey = async (
  voyageKey: string,
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager
    .createQueryBuilder(ContainerEntity, 'container')
    .where('container.VOYAGEKEY = :voyageKey', {
      voyageKey: voyageKey,
    })
    .getOne();
};

const findContainerByVoyageKeyy = async (voyageKey: string) => {
  return await containerReposiory
    .createQueryBuilder('container')
    .where('container.VOYAGEKEY = :voyageKey', {
      voyageKey: voyageKey,
    })
    .getOne();
};

export {
  createVessel,
  updateVessel,
  findVesselByCode,
  deleteVesselMany,
  getAllVessel,
  findVessel,
  findVesselInBoundVoyage,
  findContainerByVoyageKey,
  findContainerByVoyageKeyy,
};
