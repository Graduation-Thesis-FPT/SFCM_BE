import { EntityManager } from 'typeorm';
import mssqlConnection from '../dbs/mssql.connect';
import { DiscountTariffEntity } from '../entity/discount-tariff.entity';
import { DiscountTariff } from '../models/discount-tariff.model';

export const discountTariffRepository = mssqlConnection.getRepository(DiscountTariffEntity);

const findDiscountTariffById = async (rowId: string) => {
  return await discountTariffRepository
    .createQueryBuilder('discountTariff')
    .where('discountTariff.ROWGUID = :rowId', { rowId: rowId })
    .getOne();
};

const createDiscountTariff = async (
  discountTariffList: DiscountTariff[],
  transactionEntityManager: EntityManager,
) => {
  const discountTariff = discountTariffRepository.create(discountTariffList);

  return await transactionEntityManager.save(discountTariff);
};

const updateDiscountTariff = async (
  discountTariffList: DiscountTariff[],
  transactionEntityManager: EntityManager,
) => {
  return await Promise.all(
    discountTariffList.map(discountTariff =>
      transactionEntityManager.update(DiscountTariffEntity, discountTariff.ROWGUID, discountTariff),
    ),
  );
};

const deleteDiscountTariff = async (discountTariffRowID: string[]) => {
  return await discountTariffRepository.delete(discountTariffRowID);
};

const findDiscountTariff = async (discountTariffID: string) => {
  return await discountTariffRepository
    .createQueryBuilder('tariff')
    .where('tariff.ROWGUID = :discountTariffID', { discountTariffID: discountTariffID })
    .getOne();
};

const getAllDiscountTariff = async () => {
  return await discountTariffRepository.find({
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
    .createQueryBuilder(DiscountTariffEntity, 'tariff')
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
  return await discountTariffRepository
    .createQueryBuilder('tariff')
    .where('tariff.TRF_CODE = :tariffCode', { tariffCode: tariffCode })
    .andWhere('tariff.METHOD_CODE = :methodCode', { methodCode: methodCode })
    .andWhere('tariff.ITEM_TYPE_CODE = :itemTypeCode', { itemTypeCode: itemTypeCode })
    .getOne();
};

const isDuplicateTariff = async (trfTemp: string) => {
  return await discountTariffRepository
    .createQueryBuilder('tariff')
    .where('tariff.TRF_TEMP = :trfTemp', { trfTemp: trfTemp })
    .getOne();
};

const isDuplicateTariffTemp = async (tariffTemp: string) => {
  return await discountTariffRepository
    .createQueryBuilder('tariff')
    .andWhere('tariff.TRF_TEMP = :tariffTemp', { tariffTemp: tariffTemp })
    .getOne();
};

const getTariffTemp = async () => {
  return await discountTariffRepository
    .createQueryBuilder('tariff')
    .select('tariff.TRF_TEMP', 'TRF_TEMP')
    .getRawMany();
};

const getDiscountTariffByTemplate = async (tariffTemplate: string) => {
  return await discountTariffRepository
    .createQueryBuilder('discountTariff')
    .where('discountTariff.TRF_TEMP_CODE = :tariffTemplate', { tariffTemplate: tariffTemplate })
    .orderBy('discountTariff.TRF_CODE', 'ASC')
    .getMany();
};

const getTariffDates = async () => {
  return await discountTariffRepository
    .createQueryBuilder('tariff')
    .select('tariff.TRF_TEMP', 'TRF_TEMP')
    .addSelect('MIN(tariff.FROM_DATE)', 'FROM_DATE')
    .addSelect('MIN(tariff.TO_DATE)', 'TO_DATE')
    .groupBy('tariff.TRF_TEMP')
    .getRawMany();
};

export {
  findDiscountTariffById,
  createDiscountTariff,
  updateDiscountTariff,
  findDiscountTariff,
  deleteDiscountTariff,
  getAllDiscountTariff,
  isMatchTariff,
  getTariffTemp,
  getDiscountTariffByTemplate,
  isDuplicateTariff,
  isDuplicateTariffTemp,
  getTariffDates,
  isMatchTariffUpdate,
};
