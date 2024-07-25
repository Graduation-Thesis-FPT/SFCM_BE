import mssqlConnection from '../db/mssql.connect';
import { PalletStockEntity } from '../entity/pallet-stock.entity';
import { User } from '../entity/user.entity';
import { Cell as CellEntity } from '../entity/cell.entity';
import { Package } from '../entity/package.entity';

const palletRepository = mssqlConnection.getRepository(PalletStockEntity);
const cellRepository = mssqlConnection.getRepository(CellEntity);
const packageRepository = mssqlConnection.getRepository(Package);

const updatePallet = async (cellId: string, PalletNo: string, createBy: User) => {
  return await palletRepository
    .createQueryBuilder('pallet')
    .update(PalletStockEntity)
    .set({
      PALLET_STATUS: 'S', //update lại pallet đó có trạng thái là Stacking
      CELL_ID: cellId,
      UPDATE_BY: createBy.ROWGUID,
    })
    .where('PALLET_NO = :PalletNo', { PalletNo })
    .execute();
};

const findPallet = async (PalletNo: string) => {
  return await palletRepository.findOne({
    where: {
      PALLET_NO: PalletNo,
    },
  });
};

const getAllPalletPositionByWarehouseCode = async (warehouseCode: string) => {
  return await cellRepository
    .createQueryBuilder('cell')
    .innerJoinAndSelect('BS_BLOCK', 'block', 'block.BLOCK_CODE = cell.BLOCK_CODE')
    .leftJoinAndSelect('DT_PALLET_STOCK', 'pallet', 'pallet.CELL_ID = cell.ROWGUID')
    .leftJoinAndSelect('JOB_QUANTITY_CHECK', 'job', 'pallet.JOB_QUANTITY_ID = job.ROWGUID') // lấy thêm thông tin job của pallet
    .where('block.WAREHOUSE_CODE = :warehouseCode', { warehouseCode })
    .select([
      'job.PACKAGE_ID as PACKAGE_ID',
      'job.ESTIMATED_CARGO_PIECE as ESTIMATED_CARGO_PIECE',
      'job.ACTUAL_CARGO_PIECE as ACTUAL_CARGO_PIECE',
      'job.SEQ as SEQ',
      'job.START_DATE as START_DATE',
      'job.JOB_STATUS as JOB_STATUS',
      'job.NOTE as NOTE',
      'pallet.CELL_ID as CELL_ID',
      'pallet.PALLET_STATUS as PALLET_STATUS',
      'pallet.PALLET_NO as PALLET_NO',
      'cell.ROWGUID as ROWGUID',
      'cell.BLOCK_CODE as BLOCK_CODE',
      'cell.CELL_LENGTH as CELL_LENGTH',
      'cell.CELL_WIDTH as CELL_WIDTH',
      'cell.CELL_HEIGHT as CELL_HEIGHT',
      'cell.TIER_ORDERED as TIER_ORDERED',
      'cell.SLOT_ORDERED as SLOT_ORDERED',
      'cell.STATUS as STATUS',
      'block.WAREHOUSE_CODE as WAREHOUSE_CODE',
      'block.BLOCK_NAME as BLOCK_NAME',
    ])
    .getRawMany();
};

const getPalletByStatus = async (palletStatus: string) => {
  return await palletRepository
    .createQueryBuilder('pallet')
    .leftJoinAndSelect('JOB_QUANTITY_CHECK', 'job', 'pallet.JOB_QUANTITY_ID = job.ROWGUID')
    .where('PALLET_STATUS = :palletStatus', { palletStatus }) // truyền I để lấy pallet chưa vào kho
    .select([
      'job.ROWGUID as JOB_ROWGUID',
      'job.PACKAGE_ID as PACKAGE_ID',
      'job.ESTIMATED_CARGO_PIECE as ESTIMATED_CARGO_PIECE',
      'job.ACTUAL_CARGO_PIECE as ACTUAL_CARGO_PIECE',
      'job.SEQ as SEQ',
      'job.START_DATE as START_DATE',
      'job.JOB_STATUS as JOB_STATUS',
      'job.NOTE as NOTE',
      'pallet.PALLET_NO as PALLET_NO',
      'pallet.CELL_ID as CELL_ID',
      'pallet.PALLET_STATUS as PALLET_STATUS',
      'pallet.PALLET_LENGTH as PALLET_LENGTH',
      'pallet.PALLET_WIDTH as PALLET_WIDTH',
      'pallet.PALLET_HEIGHT as PALLET_HEIGHT',
    ])
    .getRawMany();
};

const getStackingPallet = async (warehouseCode: string) => {
  return await packageRepository
    .createQueryBuilder('package')
    .innerJoin('JOB_QUANTITY_CHECK', 'job', 'package.ROWGUID = job.PACKAGE_ID')
    .innerJoin('DT_PALLET_STOCK', 'pallet', 'job.ROWGUID = pallet.JOB_QUANTITY_ID')
    .innerJoin('BS_CELL', 'cell', 'pallet.CELL_ID = cell.ROWGUID')
    .innerJoin('BS_BLOCK', 'block', 'cell.BLOCK_CODE = block.BLOCK_CODE')
    .innerJoin('BS_WAREHOUSE', 'warehouse', 'block.WAREHOUSE_CODE = warehouse.WAREHOUSE_CODE')
    .where('warehouse.WAREHOUSE_CODE = :warehouseCode', { warehouseCode })
    .andWhere('package.JOB_TYPE = :jobType', { jobType: 'XK' })
    .andWhere('pallet.PALLET_STATUS = :palletStatus', { palletStatus: 'S' })
    .select([
      'job.PACKAGE_ID as PACKAGE_ID',
      'job.ESTIMATED_CARGO_PIECE as ESTIMATED_CARGO_PIECE',
      'job.ACTUAL_CARGO_PIECE as ACTUAL_CARGO_PIECE',
      'job.SEQ as SEQ',
      'job.START_DATE as START_DATE',
      'job.JOB_STATUS as JOB_STATUS',
      'job.NOTE as NOTE',
      'pallet.CELL_ID as CELL_ID',
      'pallet.PALLET_STATUS as PALLET_STATUS',
      'pallet.PALLET_NO as PALLET_NO',
      'cell.BLOCK_CODE as BLOCK_CODE',
      'cell.CELL_LENGTH as CELL_LENGTH',
      'cell.CELL_WIDTH as CELL_WIDTH',
      'cell.CELL_HEIGHT as CELL_HEIGHT',
      'cell.TIER_ORDERED as TIER_ORDERED',
      'cell.SLOT_ORDERED as SLOT_ORDERED',
      'cell.STATUS as STATUS',
      'block.WAREHOUSE_CODE as WAREHOUSE_CODE',
      'block.BLOCK_NAME as BLOCK_NAME',
      'package.JOB_TYPE as JOB_TYPE',
    ])
    .getRawMany();
};

export {
  updatePallet,
  findPallet,
  getAllPalletPositionByWarehouseCode,
  getPalletByStatus,
  getStackingPallet,
};
