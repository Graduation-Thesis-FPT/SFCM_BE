import { EntityManager, Not } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { Package as PackageEntity } from '../entity/package.entity';
import { Package } from '../models/packageMnfLd.model';
import { ContainerEntity } from '../entity/container.entity';

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

export {
  check4UpdatenDelete,
  check4AddnUpdate,
  createPackage,
  updatePackage,
  getPackage,
  deletePackage,
};
