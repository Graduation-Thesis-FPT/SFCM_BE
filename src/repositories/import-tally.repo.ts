import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { DeliverOrderEntity } from '../entity/deliver-order.entity';
import { JobQuantityCheckEntity } from '../entity/job-quantity-check.entity';
import { Package as PackageEntity } from '../entity/package.entity';
import { JobQuantityCheck as JobQuantityCheckModel } from '../models/job-quantity-check.model';
import { PalletStockEntity } from '../entity/pallet-stock.entity';
import { PalletModel } from '../models/pallet-stock.model';
import moment from 'moment';

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

function incrementPalletNumber(palletNumber: any) {
  let number = parseInt(palletNumber, 10);
  number++;
  return number.toString().padStart(palletNumber.length, '0');
}

export const insertJobAndPallet = async (
  listData: any,
  transactionalEntityManager: EntityManager,
) => {
  listData.sort((a: any, b: any) => a.SEQ - b.SEQ);

  const stt = await transactionalEntityManager
    .createQueryBuilder(PalletStockEntity, 'pallet')
    .select('pallet.PALLET_NO', 'PALLET_NO')
    .orderBy("RIGHT(pallet.PALLET_NO, CHARINDEX('/', REVERSE(pallet.PALLET_NO)) - 1)", 'DESC')
    .limit(1)
    .getRawOne();

  let newStt = stt?.PALLET_NO?.split('-').pop() ?? '000000';
  newStt = incrementPalletNumber(newStt);

  for (const data of listData) {
    const jobQuantityCheck = await transactionalEntityManager
      .createQueryBuilder()
      .insert()
      .into(JobQuantityCheckEntity)
      .values(data)
      .execute();
    const JOB_QUANTITY_ID = jobQuantityCheck.identifiers[0].ROWGUID;

    await transactionalEntityManager
      .createQueryBuilder()
      .insert()
      .into(PalletStockEntity)
      .values({
        PALLET_NO: `${data.HOUSE_BILL}/${moment().format('DD')}/${moment().format('MM')}/${moment().format('YYYY')}/${data.SEQ}-${newStt}`,
        PALLET_STATUS: 'I',
        JOB_QUANTITY_ID: JOB_QUANTITY_ID,
        PALLET_HEIGHT: data.PALLET_HEIGHT,
        PALLET_LENGTH: data.PALLET_LENGTH,
        PALLET_WIDTH: data.PALLET_WIDTH,
        CREATE_BY: data.CREATE_BY,
        UPDATE_BY: data.CREATE_BY,
      })
      .execute();

    newStt = incrementPalletNumber(newStt);
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

export const completeJobQuantityCheckByPackageId = async (
  PACKAGE_ID: string,
  dataUpdate: any,
  transactionalEntityManager: EntityManager,
) => {
  return await transactionalEntityManager.update(
    JobQuantityCheckEntity,
    { PACKAGE_ID: PACKAGE_ID },
    dataUpdate,
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

export const checkEstimatedCargoPieceIsValid = async (
  PACKAGE_ID: string,
  transactionalEntityManager: EntityManager,
) => {
  const sum = await transactionalEntityManager
    .createQueryBuilder(JobQuantityCheckEntity, 'job')
    .select('SUM(job.ESTIMATED_CARGO_PIECE) as sum')
    .where('job.PACKAGE_ID = :package_id', { package_id: PACKAGE_ID })
    .getRawOne();
  const actual = await transactionalEntityManager
    .createQueryBuilder(PackageEntity, 'pk')
    .select('SUM(pk.CARGO_PIECE) as acctual')
    .where('pk.ROWGUID = :id', { id: PACKAGE_ID })
    .getRawOne();
  if (sum.sum > actual.acctual) {
    return false;
  }
  return true;
};

export const checkCanCompoleteJobQuantityCheck = async (PACKAGE_ID: string) => {
  const sum = await tbJobQuantityCheck
    .createQueryBuilder('job')
    .select('SUM(job.ESTIMATED_CARGO_PIECE) as sum')
    .where('job.PACKAGE_ID = :package_id', { package_id: PACKAGE_ID })
    .andWhere('job.JOB_STATUS = :job_status', { job_status: 'I' })
    .getRawOne();
  const actual = await tbPackage
    .createQueryBuilder('pk')
    .select('SUM(pk.CARGO_PIECE) as acctual')
    .where('pk.ROWGUID = :id', { id: PACKAGE_ID })
    .getRawOne();
  if (sum.sum === actual.acctual) {
    return true;
  }
  return false;
};

export const checkSEQExist = async (PACKAGE_ID: string, SEQ: number) => {
  return await tbJobQuantityCheck.findOne({ where: { PACKAGE_ID: PACKAGE_ID, SEQ: SEQ } });
};

export const checkJobStatus = async (ROWGUID: string, JOB_STATUS: string) => {
  return await tbJobQuantityCheck.findOne({ where: { ROWGUID: ROWGUID, JOB_STATUS: JOB_STATUS } });
};
