import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { TariffCode } from '../models/tariff-code.model';
import { TariffTempEntity } from '../entity/tariff-temp.entity';
import { TariffTemp } from '../models/tariff-temp.model';

export const tariffTempCodeRepository = mssqlConnection.getRepository(TariffTempEntity);

const findTariffCodeByCode = async (
  tariffCode: string,
  transactionEntityManager: EntityManager,
) => {
  return await transactionEntityManager
    .createQueryBuilder(TariffTempEntity, 'tariffCode')
    .where('tariffCode.TRF_CODE = :tariffCode', { tariffCode: tariffCode })
    .getOne();
};

const createTariffTemp = async (tariffCodeList: TariffTemp[]) => {
  const tariffCode = tariffTempCodeRepository.create(tariffCodeList);

  return await tariffTempCodeRepository.save(tariffCode);
};

const updateTariffCode = async (
  tariffCodeList: TariffCode[],
  transactionEntityManager: EntityManager,
) => {
  return await Promise.all(
    tariffCodeList.map(tariffCode =>
      transactionEntityManager.update(TariffTempEntity, tariffCode.TRF_CODE, tariffCode),
    ),
  );
};

const deleteTariffTemp = async (tariffTempCode: string[]) => {
  return await tariffTempCodeRepository.delete(tariffTempCode);
};

const findTariffTemp = async (tariffTempCode: string) => {
  return await tariffTempCodeRepository
    .createQueryBuilder('tariffTempCode')
    .where('tariffTempCode.TRF_TEMP_CODE = :tariffTempCode', { tariffTempCode: tariffTempCode })
    .getOne();
};

const getAllTariffTemp = async () => {
  return await tariffTempCodeRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

export {
  findTariffCodeByCode,
  createTariffTemp,
  updateTariffCode,
  findTariffTemp,
  deleteTariffTemp,
  getAllTariffTemp,
};
