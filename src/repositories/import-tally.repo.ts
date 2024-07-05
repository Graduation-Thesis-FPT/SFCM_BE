import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { DeliverOrderEntity } from '../entity/deliver-order.entity';
import { JobQuantityCheckEntity } from '../entity/job-quantity-check.entity';
import { Package as PackageEntity } from '../entity/package.entity';
import { JobQuantityCheck as JobQuantityCheckModel } from '../models/job-quantity-check.model';
import { PalletStockEntity } from '../entity/pallet-stock.entity';
import { PalletModel } from '../models/pallet-stock.model';

const tbJobQuantityCheck = mssqlConnection.getRepository(JobQuantityCheckEntity);
const tbDeliverOrder = mssqlConnection.getRepository(DeliverOrderEntity);
const tbPackage = mssqlConnection.getRepository(PackageEntity);
const tbPalletStock = mssqlConnection.getRepository(PalletStockEntity);

export const getAllImportTallyContainer = async () => {
  return await tbDeliverOrder
    .createQueryBuilder('do')
    .leftJoinAndSelect('DT_CNTR_MNF_LD', 'cn', 'do.CONTAINER_ID = cn.ROWGUID')
    .where('do.JOB_CHK = :job_chk', { job_chk: 0 })
    .andWhere('do.DE_ORDER_NO like :de_order_no', { de_order_no: 'NK%' })
    .select([
      'cn.CNTRNO as CNTRNO',
      'do.CONTAINER_ID as CONTAINER_ID',
      'do.ISSUE_DATE as ISSUE_DATE',
      'do.EXP_DATE as EXP_DATE',
    ])
    .getRawMany();
};

export const getImportTallyContainerInfoByCONTAINER_ID = async (CONTAINER_ID: string) => {
  return await tbPackage
    .createQueryBuilder('pk')
    .leftJoinAndSelect('DT_CNTR_MNF_LD', 'cn', 'pk.CONTAINER_ID = cn.ROWGUID')
    .leftJoinAndSelect('BS_PACKAGE_UNIT', 'pku', 'pk.PACKAGE_UNIT_CODE = pku.PACKAGE_UNIT_CODE')
    .where('cn.ROWGUID = :rowguid', { rowguid: CONTAINER_ID })
    .select([
      'cn.BILLOFLADING as BILLOFLADING',
      'cn.CNTRNO as CNTRNO',
      'cn.CNTRSZTP as CNTRSZTP',
      'cn.COMMODITYDESCRIPTION as COMMODITYDESCRIPTION',
      'cn.CONSIGNEE as CONSIGNEE',
      'cn.SEALNO as SEALNO',
      'cn.STATUSOFGOOD as STATUSOFGOOD',
      'cn.VOYAGEKEY as VOYAGEKEY',
      'pk.CARGO_PIECE as CARGO_PIECE',
      'pk.CBM as CBM',
      'pk.CONTAINER_ID as CONTAINER_ID',
      'pk.DECLARE_NO as DECLARE_NO',
      'pk.HOUSE_BILL as HOUSE_BILL',
      'pk.NOTE as NOTE',
      'pk.PACKAGE_UNIT_CODE as PACKAGE_UNIT_CODE',
      'pku.PACKAGE_UNIT_NAME as PACKAGE_UNIT_NAME',
      'pk.ROWGUID as PK_ROWGUID',
    ])
    .getRawMany();
};

export const getAllJobQuantityCheckByPACKAGE_ID = async (PACKAGE_ID: string) => {
  return await tbJobQuantityCheck
    .createQueryBuilder('job')
    .leftJoinAndSelect('DT_PALLET_STOCK', 'pl', 'job.ROWGUID = pl.JOB_QUANTITY_ID')
    .where('job.PACKAGE_ID = :package_id', { package_id: PACKAGE_ID })
    .select([
      'job.ROWGUID as ROWGUID',
      'job.PACKAGE_ID as PACKAGE_ID',
      'job.ESTIMATED_CARGO_PIECE as ESTIMATED_CARGO_PIECE',
      'job.ACTUAL_CARGO_PIECE as ACTUAL_CARGO_PIECE',
      'job.SEQ as SEQ',
      'job.START_DATE as START_DATE',
      'job.FINISH_DATE as FINISH_DATE',
      'job.JOB_STATUS as JOB_STATUS',
      'job.NOTE as NOTE',
      'pl.PALLET_NO as PALLET_NO',
      'pl.PALLET_LENGTH as PALLET_LENGTH',
      'pl.PALLET_WIDTH as PALLET_WIDTH',
      'pl.PALLET_HEIGHT as PALLET_HEIGHT',
    ])
    .orderBy('job.SEQ', 'ASC')
    .getRawMany();
};

export const insertJobQuantityCheck = async (
  listData: JobQuantityCheckModel[],
  transactionalEntityManager: EntityManager,
) => {
  const createData = tbJobQuantityCheck.create(listData);
  return await transactionalEntityManager.save(createData);
};

export const insertJobAndPallet = async (
  listData: any,
  transactionalEntityManager: EntityManager,
) => {
  for (const data of listData) {
    const jobQuantityCheck = await transactionalEntityManager
      .createQueryBuilder()
      .insert()
      .into(JobQuantityCheckEntity)
      .values(data)
      .execute();

    const JOB_QUANTITY_ID = jobQuantityCheck.identifiers[0].ROWGUID;
    const palletStock = await transactionalEntityManager
      .createQueryBuilder()
      .insert()
      .into(PalletStockEntity)
      .values({
        PALLET_NO: `${data.HOUSE_BILL}/${data.ESTIMATED_CARGO_PIECE}/${data.ACTUAL_CARGO_PIECE}/${data.SEQ}`,
        JOB_QUANTITY_ID: JOB_QUANTITY_ID,
        PALLET_HEIGHT: data.PALLET_HEIGHT,
        PALLET_LENGTH: data.PALLET_LENGTH,
        PALLET_WIDTH: data.PALLET_WIDTH,
        CREATE_BY: data.CREATE_BY,
        UPDATE_BY: data.CREATE_BY,
      })
      .execute();
  }
  return [{}];
};

export const updateJobQuantityCheck = async (
  listData: JobQuantityCheckModel[],
  transactionalEntityManager: EntityManager,
) => {
  return await Promise.all(
    listData.map(data =>
      transactionalEntityManager.update(JobQuantityCheckEntity, data.ROWGUID, data),
    ),
  );
};

export const insertPalletStock = async (
  listData: JobQuantityCheckModel[],
  transactionalEntityManager: EntityManager,
) => {
  const createData = tbPalletStock.create(listData);
  return await transactionalEntityManager.save(createData);
};

export const updatePalletStock = async (
  listData: PalletModel[],
  transactionalEntityManager: EntityManager,
) => {
  return await Promise.all(
    listData.map(data =>
      transactionalEntityManager.update(PalletStockEntity, data.PALLET_NO, data),
    ),
  );
};

//check
export const checkPackageIdExist = async (PACKAGE_ID: string) => {
  return await tbPackage.findOne({ where: { ROWGUID: PACKAGE_ID } });
};

export const checkJobQuantityIdExist = async (ROWGUID: string) => {
  return await tbJobQuantityCheck.findOne({ where: { ROWGUID: ROWGUID } });
};

export const checkPalletNoExist = async (PALLET_NO: string) => {
  return await tbPalletStock.findOne({ where: { PALLET_NO: PALLET_NO } });
};
