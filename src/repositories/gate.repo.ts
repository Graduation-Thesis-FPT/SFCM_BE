import mssqlConnection from '../db/mssql.connect';
import { Gate as GateEntity } from '../entity/gate.entity';
import { Gate } from '../models/gate.model';

export const gateRepository = mssqlConnection.getRepository(GateEntity);

const createGate = async (gateListInfo: Gate[]) => {
  const gate = gateRepository.create(gateListInfo);

  const newGate = await gateRepository.save(gate);
  return newGate;
};

const updateGate = async (gateListInfo: Gate[]) => {
  return await Promise.all(gateListInfo.map(gate => gateRepository.update(gate.GATE_CODE, gate)));
};

const isDuplicateGate = async (gateName: string) => {
  return await gateRepository
    .createQueryBuilder('gate')
    .where('gate.GATE_NAME = :gateName', { gateName: gateName })
    .getOne();
};

const findGateByGateCode = async (gateCode: string) => {
  return await gateRepository
    .createQueryBuilder('gate')
    .where('gate.GATE_CODE = :gateCode', { gateCode: gateCode })
    .getOne();
};

export { isDuplicateGate, createGate, findGateByGateCode, updateGate };
