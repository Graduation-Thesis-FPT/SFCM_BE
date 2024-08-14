import { EntityManager, Not } from 'typeorm';
import mssqlConnection from '../dbs/mssql.connect';
import { ContainerEntity } from '../entity/container.entity';
import { Package as PackageEntity } from '../entity/package.entity';
import { Package } from '../models/packageMnfLd.model';
import { palletRepository } from './pallet.repo';

export const containerRepository = mssqlConnection.getRepository(ContainerEntity);
export const packageRepository = mssqlConnection.getRepository(PackageEntity);

// check them dieu kien insert update
const check4AddnUpdate = async (pack: Package) => {
  let whereObj: any = {
    CONTAINER_ID: pack.CONTAINER_ID,
    HOUSE_BILL: pack.HOUSE_BILL,
  };
  pack.ROWGUID ? (whereObj['ROWGUID'] = Not(pack.ROWGUID)) : '';
  const checkExist = await packageRepository.find({
    where: whereObj,
  });
  if (!checkExist.length) return false;
  return true;
};

const check4UpdatenDelete = async (refcont: string) => {
  const isSuccess = await containerRepository.find({
    where: { ROWGUID: refcont, STATUSOFGOOD: false },
  });
  if (!isSuccess.length) return false;
  return true;
};
/// here
const createPackage = async (
  packageListInfo: Package[],
  transactionalEntityManager: EntityManager,
) => {
  const packagee = packageRepository.create(packageListInfo);
  return transactionalEntityManager.save(packagee);
};

const updatePackage = async (
  packageListInfo: Package[],
  transactionalEntityManager: EntityManager,
) => {
  return await Promise.all(
    packageListInfo.map(packageData =>
      transactionalEntityManager.update(PackageEntity, packageData.ROWGUID, packageData),
    ),
  );
};

const updatePackageTimeIn = async (packageData: Package, createBy: string) => {
  return await packageRepository
    .createQueryBuilder('package')
    .update(PackageEntity)
    .set({
      TIME_IN: new Date(),
      UPDATE_BY: createBy,
    })
    .where('ROWGUID = :ROWGUID', { ROWGUID: packageData.ROWGUID })
    .execute();
};

const updatePackageTimeOut = async (packageData: Package, createBy: string) => {
  return await packageRepository
    .createQueryBuilder('package')
    .update(PackageEntity)
    .set({
      TIME_OUT: new Date(),
      UPDATE_BY: createBy,
    })
    .where('ROWGUID = :ROWGUID', { ROWGUID: packageData.ROWGUID })
    .execute();
};

const getPackage = async (refContainer: string) => {
  return await packageRepository.find({
    select: {
      ROWGUID: true,
      HOUSE_BILL: true,
      ITEM_TYPE_CODE: true,
      PACKAGE_UNIT_CODE: true,
      CARGO_PIECE: true,
      CBM: true,
      DECLARE_NO: true,
      CONTAINER_ID: true,
      NOTE: true,
    },
    order: {
      UPDATE_DATE: 'DESC',
    },
    where: { CONTAINER_ID: refContainer },
  });
};

const deletePackage = async (packgeListId: string[]) => {
  return await packageRepository.delete(packgeListId);
};

const findPackageByPalletNo = async (palletNo: string) => {
  return await palletRepository
    .createQueryBuilder('pallet')
    .innerJoinAndSelect('JOB_QUANTITY_CHECK', 'job', 'job.ROWGUID = pallet.JOB_QUANTITY_ID')
    .innerJoinAndSelect('DT_PACKAGE_MNF_LD', 'package', 'package.ROWGUID = job.PACKAGE_ID')
    .where('pallet.PALLET_NO = :palletNo', { palletNo })
    .select([
      'package.ROWGUID as ROWGUID',
      'package.HOUSE_BILL as HOUSE_BILL',
      'package.ITEM_TYPE_CODE as ITEM_TYPE_CODE',
      'package.PACKAGE_UNIT_CODE as PACKAGE_UNIT_CODE',
      'package.CARGO_PIECE as CARGO_PIECE',
      'package.CBM as CBM',
      'package.DECLARE_NO as DECLARE_NO',
      'package.CONTAINER_ID as CONTAINER_ID',
      'package.NOTE as NOTE',
    ])
    .limit(1)
    .getRawOne();
};

const findPackage = async (rowId: string) => {
  return await packageRepository
    .createQueryBuilder('package')
    .leftJoinAndSelect('BS_ITEM_TYPE', 'item', 'package.ITEM_TYPE_CODE = item.ITEM_TYPE_CODE')
    .where('package.ROWGUID = :rowId', { rowId })
    .select([
      'package.ROWGUID as ROWGUID',
      'package.HOUSE_BILL as HOUSE_BILL',
      'package.ITEM_TYPE_CODE as ITEM_TYPE_CODE',
      'package.PACKAGE_UNIT_CODE as PACKAGE_UNIT_CODE',
      'package.CARGO_PIECE as CARGO_PIECE',
      'package.CBM as CBM',
      'package.DECLARE_NO as DECLARE_NO',
      'package.CONTAINER_ID as CONTAINER_ID',
      'package.NOTE as NOTE',
      'item.ITEM_TYPE_NAME as ITEM_TYPE_NAME',
      'package.TIME_IN as TIME_IN',
      'package.TIME_OUT as TIME_OUT',
    ])
    .getRawOne();
};

export {
  check4AddnUpdate,
  check4UpdatenDelete,
  createPackage,
  deletePackage,
  findPackage,
  getPackage,
  updatePackage,
  findPackageByPalletNo,
  updatePackageTimeIn,
  updatePackageTimeOut,
};
