import { EntityManager } from 'typeorm';
import mssqlConnection from '../dbs/mssql.connect';
import { Gate as GateEntity } from '../entity/gate.entity';
import { Gate } from '../models/gate.model';

export const gateRepository = mssqlConnection.getRepository(GateEntity);

const createGate = async (gateListInfo: Gate[], transactionEntityManager: EntityManager) => {
  const gate = gateRepository.create(gateListInfo);

  const newGate = await transactionEntityManager.save(gate);
  return newGate;
};

const updateGate = async (gateListInfo: Gate[], transactionEntityManager: EntityManager) => {
  return await Promise.all(
    gateListInfo.map(gate => transactionEntityManager.update(GateEntity, gate.GATE_CODE, gate)),
  );
};

const isDuplicateGate = async (gateName: string) => {
  return await gateRepository
    .createQueryBuilder('gate')
    .where('gate.GATE_NAME = :gateName', { gateName: gateName })
    .getOne();
};

const findGateByGateCode = async (gateCode: string, transactionEntityManager: EntityManager) => {
  return await transactionEntityManager
    .createQueryBuilder(GateEntity, 'gate')
    .where('gate.GATE_CODE = :gateCode', { gateCode: gateCode })
    .getOne();
};

const findGate = async (gateCode: string) => {
  return await gateRepository
    .createQueryBuilder('gate')
    .where('gate.GATE_CODE = :gateCode', { gateCode: gateCode })
    .getOne();
};

const deleteGateMany = async (gateCode: string[]) => {
  return await gateRepository.delete(gateCode);
};

const getAllGate = async () => {
  return await gateRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

export {
  isDuplicateGate,
  createGate,
  findGateByGateCode,
  updateGate,
  deleteGateMany,
  getAllGate,
  findGate,
};
