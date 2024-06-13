import { EntityManager, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { Customer as CustomerEntity } from '../entity/customer.entity';
import { Vessel as VesselEntity } from '../entity/vessel.entity';
import { Vessel } from '../models/vessel.model';

export const vesselRepository = mssqlConnection.getRepository(VesselEntity);

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
  const filterRule = {
    ETA: MoreThanOrEqual(rule?.fromDate),
    ETD: LessThanOrEqual(rule?.toDate),
  };
  return await vesselRepository.find({
    where: rule ? filterRule : {},
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

export { createVessel, updateVessel, findVesselByCode, deleteVesselMany, getAllVessel, findVessel };
