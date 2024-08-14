import { Brackets, EntityManager } from 'typeorm';
import mssqlConnection from '../dbs/mssql.connect';
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
    .createQueryBuilder('deo')
    .select([
      'cont.CNTRNO as CNTRNO',
      'deo.CONTAINER_ID as CONTAINER_ID',
      'deo.ISSUE_DATE as ISSUE_DATE',
      'deo.EXP_DATE as EXP_DATE',
    ])
    .innerJoin('DT_CNTR_MNF_LD', 'cont', 'deo.CONTAINER_ID = cont.ROWGUID')
    .innerJoin('DT_PACKAGE_MNF_LD', 'pk', 'pk.CONTAINER_ID = cont.ROWGUID')
    .leftJoin('JOB_QUANTITY_CHECK', 'job', 'job.PACKAGE_ID = pk.ROWGUID')
    .leftJoin('DT_PALLET_STOCK', 'pallet', 'pallet.JOB_QUANTITY_ID = job.ROWGUID')
    .where('deo.DE_ORDER_NO LIKE :orderNo', { orderNo: '%NK%' })
    .andWhere(
      new Brackets((qb: any) => {
        qb.where('pallet.PALLET_STATUS IS NULL').orWhere('pallet.PALLET_STATUS = :status', {
          status: 'I',
        });
      }),
    )
    .groupBy('cont.CNTRNO')
    .addGroupBy('deo.CONTAINER_ID')
    .addGroupBy('deo.ISSUE_DATE')
    .addGroupBy('deo.EXP_DATE')
    .getRawMany();
  // return await tbDeliverOrder
  //   .createQueryBuilder('do')
  //   .leftJoinAndSelect('DT_CNTR_MNF_LD', 'cn', 'do.CONTAINER_ID = cn.ROWGUID')
  //   .where('do.JOB_CHK = :job_chk', { job_chk: 0 })
  //   .andWhere('do.DE_ORDER_NO like :de_order_no', { de_order_no: 'NK%' })
  //   .select([
  //     'cn.CNTRNO as CNTRNO',
  //     'do.CONTAINER_ID as CONTAINER_ID',
  //     'do.ISSUE_DATE as ISSUE_DATE',
  //     'do.EXP_DATE as EXP_DATE',
  //   ])
  //   .getRawMany();
};

export const getImportTallyContainerInfoByCONTAINER_ID = async (CONTAINER_ID: string) => {
  return await tbPackage
    .createQueryBuilder('pk')
    .leftJoinAndSelect('DT_CNTR_MNF_LD', 'cn', 'pk.CONTAINER_ID = cn.ROWGUID')
    .leftJoinAndSelect('BS_PACKAGE_UNIT', 'pku', 'pk.PACKAGE_UNIT_CODE = pku.PACKAGE_UNIT_CODE')
    .leftJoinAndSelect('BS_ITEM_TYPE', 'item', 'pk.ITEM_TYPE_CODE = item.ITEM_TYPE_CODE')
    .leftJoinAndSelect('JOB_QUANTITY_CHECK', 'job', 'pk.ROWGUID = job.PACKAGE_ID')
    .groupBy('cn.BILLOFLADING')
    .addGroupBy('cn.CNTRNO')
    .addGroupBy('cn.CNTRSZTP')
    .addGroupBy('cn.COMMODITYDESCRIPTION')
    .addGroupBy('cn.CONSIGNEE')
    .addGroupBy('cn.SEALNO')
    .addGroupBy('cn.STATUSOFGOOD')
    .addGroupBy('cn.VOYAGEKEY')
    .addGroupBy('pk.CARGO_PIECE')
    .addGroupBy('pk.CBM')
    .addGroupBy('pk.CONTAINER_ID')
    .addGroupBy('pk.DECLARE_NO')
    .addGroupBy('pk.HOUSE_BILL')
    .addGroupBy('pk.NOTE')
    .addGroupBy('pk.PACKAGE_UNIT_CODE')
    .addGroupBy('pku.PACKAGE_UNIT_NAME')
    .addGroupBy('pk.ROWGUID')
    .addGroupBy('job.JOB_STATUS')
    .addGroupBy('item.ITEM_TYPE_NAME')
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
      'job.JOB_STATUS as JOB_STATUS',
      'item.ITEM_TYPE_NAME as ITEM_TYPE_NAME',
    ])
    .orderBy(
      `CASE WHEN job.JOB_STATUS = 'C' THEN 1 WHEN job.JOB_STATUS = 'I' THEN 2 WHEN job.JOB_STATUS IS NULL THEN 3 ELSE 4 END`,
    )
    .getRawMany();
};

export const getAllJobQuantityCheckByPackageId = async (PACKAGE_ID: string) => {
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
      'pl.PALLET_NO as PALLET_NO',
      'pl.PALLET_LENGTH as PALLET_LENGTH',
      'pl.PALLET_WIDTH as PALLET_WIDTH',
      'pl.PALLET_HEIGHT as PALLET_HEIGHT',
      'pl.NOTE as NOTE',
    ])
    .orderBy('job.SEQ', 'ASC')
    .getRawMany();
};

function formatNewStt(newStt: number) {
  return newStt.toString().padStart(4, '0');
}

export const insertJobAndPallet = async (
  listData: any,
  transactionalEntityManager: EntityManager,
) => {
  listData.sort((a: any, b: any) => a.SEQ - b.SEQ);

  const stt = await transactionalEntityManager
    .createQueryBuilder(PalletStockEntity, 'pallet')
    .select('COUNT(*)', 'count')
    .getRawOne();
  let newStt = stt?.count + 1;

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
        PALLET_NO: `${data.HOUSE_BILL}/${moment().format('DD')}/${moment().format('MM')}/${moment().format('YYYY')}/${data.SEQ}-${formatNewStt(newStt)}`,
        PALLET_STATUS: 'I',
        JOB_QUANTITY_ID: JOB_QUANTITY_ID,
        NOTE: data.NOTE,
        PALLET_HEIGHT: data.PALLET_HEIGHT,
        PALLET_LENGTH: data.PALLET_LENGTH,
        PALLET_WIDTH: data.PALLET_WIDTH,
        CREATE_BY: data.CREATE_BY,
        UPDATE_BY: data.CREATE_BY,
      })
      .execute();

    newStt++;
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
