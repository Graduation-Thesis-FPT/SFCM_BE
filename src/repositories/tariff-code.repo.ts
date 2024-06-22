import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { TariffCodeEntity } from '../entity/tariff-code.entity';
import { TariffCode } from '../models/tariff-code.model';

export const tariffCodeRepository = mssqlConnection.getRepository(TariffCodeEntity);

const findTariffCodeByCode = async (
  tariffCode: string,
  transactionEntityManager: EntityManager,
) => {
  return await transactionEntityManager
    .createQueryBuilder(TariffCodeEntity, 'tariffCode')
    .where('tariffCode.TRF_CODE = :tariffCode', { tariffCode: tariffCode })
    .getOne();
};

const createTariffCode = async (
  tariffCodeList: TariffCode[],
  transactionEntityManager: EntityManager,
) => {
  const tariffCode = tariffCodeRepository.create(tariffCodeList);

  return await transactionEntityManager.save(tariffCode);
};

const updateTariffCode = async (
  tariffCodeList: TariffCode[],
  transactionEntityManager: EntityManager,
) => {
  return await Promise.all(
    tariffCodeList.map(tariffCode =>
      transactionEntityManager.update(TariffCodeEntity, tariffCode.TRF_CODE, tariffCode),
    ),
  );
};

const deleteTariffCode = async (tariffCode: string[]) => {
  return await tariffCodeRepository.delete(tariffCode);
};

const findTariffCode = async (tariffCode: string) => {
  return await tariffCodeRepository
    .createQueryBuilder('tariffCode')
    .where('tariffCode.TRF_CODE = :tariffCode', { tariffCode: tariffCode })
    .getOne();
};

const getAllTariffCode = async () => {
  return await tariffCodeRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

export {
  findTariffCodeByCode,
  createTariffCode,
  updateTariffCode,
  findTariffCode,
  deleteTariffCode,
  getAllTariffCode,
};
