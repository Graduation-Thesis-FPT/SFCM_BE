import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { TariffEntity } from '../entity/tariff.entity';
import { Tariff } from '../models/tariff.model';

export const tariffRepository = mssqlConnection.getRepository(TariffEntity);

const findTariffCodeById = async (rowId: string) => {
  return await tariffRepository
    .createQueryBuilder('tariff')
    .where('tariff.ROWGUID = :rowId', { rowId: rowId })
    .getOne();
};

const createTariff = async (tariffList: Tariff[], transactionEntityManager: EntityManager) => {
  const tariff = tariffRepository.create(tariffList);

  return await transactionEntityManager.save(tariff);
};

const updateTariff = async (tariffList: Tariff[], transactionEntityManager: EntityManager) => {
  return await Promise.all(
    tariffList.map(tariff => transactionEntityManager.update(TariffEntity, tariff.ROWGUID, tariff)),
  );
};

const deleteTariff = async (tariffRowID: string[]) => {
  return await tariffRepository.delete(tariffRowID);
};

const findTariff = async (tariffID: string) => {
  return await tariffRepository
    .createQueryBuilder('tariff')
    .where('tariff.ROWGUID = :tariffID', { tariffID: tariffID })
    .getOne();
};

const getAllTariff = async () => {
  return await tariffRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const isMatchTariff = async (
  tariffCode: string,
  methodCode: string,
  itemTypeCode: string,
  templateCode: string,
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager
    .createQueryBuilder(TariffEntity, 'tariff')
    .where('tariff.TRF_CODE = :tariffCode', { tariffCode: tariffCode })
    .andWhere('tariff.METHOD_CODE = :methodCode', { methodCode: methodCode })
    .andWhere('tariff.ITEM_TYPE_CODE = :itemTypeCode', { itemTypeCode: itemTypeCode })
    .andWhere('tariff.TRF_TEMP_CODE = :templateCode', { templateCode: templateCode })
    .getOne();
};

const isMatchTariffUpdate = async (
  tariffCode: string,
  methodCode: string,
  itemTypeCode: string,
) => {
  return await tariffRepository
    .createQueryBuilder('tariff')
    .where('tariff.TRF_CODE = :tariffCode', { tariffCode: tariffCode })
    .andWhere('tariff.METHOD_CODE = :methodCode', { methodCode: methodCode })
    .andWhere('tariff.ITEM_TYPE_CODE = :itemTypeCode', { itemTypeCode: itemTypeCode })
    .getOne();
};

const isDuplicateTariff = async (trfTemp: string) => {
  return await tariffRepository
    .createQueryBuilder('tariff')
    .where('tariff.TRF_TEMP = :trfTemp', { trfTemp: trfTemp })
    .getOne();
};

const isDuplicateTariffTemp = async (tariffTemp: string) => {
  return await tariffRepository
    .createQueryBuilder('tariff')
    .andWhere('tariff.TRF_TEMP = :tariffTemp', { tariffTemp: tariffTemp })
    .getOne();
};

const getTariffTemp = async () => {
  return await tariffRepository
    .createQueryBuilder('tariff')
    .select('tariff.TRF_TEMP', 'TRF_TEMP')
    .getRawMany();
};

const getTariffByTemplate = async (tariffTemplate: string) => {
  return await tariffRepository
    .createQueryBuilder('tariff')
    .where('tariff.TRF_TEMP_CODE = :tariffTemplate', { tariffTemplate: tariffTemplate })
    .getMany();
};

const getTariffDates = async () => {
  return await tariffRepository
    .createQueryBuilder('tariff')
    .select('tariff.TRF_TEMP', 'TRF_TEMP')
    .addSelect('MIN(tariff.FROM_DATE)', 'FROM_DATE')
    .addSelect('MIN(tariff.TO_DATE)', 'TO_DATE')
    .groupBy('tariff.TRF_TEMP')
    .getRawMany();
};

export {
  findTariffCodeById,
  createTariff,
  updateTariff,
  findTariff,
  deleteTariff,
  getAllTariff,
  isMatchTariff,
  getTariffTemp,
  getTariffByTemplate,
  isDuplicateTariff,
  isDuplicateTariffTemp,
  getTariffDates,
  isMatchTariffUpdate,
};
