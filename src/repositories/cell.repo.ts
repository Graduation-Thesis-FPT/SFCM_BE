import { EntityManager } from 'typeorm';
import mssqlConnection from '../dbs/mssql.connect';
import { Cell as CellEntity } from '../entity/cell.entity';
const cellRepository = mssqlConnection.getRepository(CellEntity);

const findCellInWarehouse = async (cellID: string, warehouseCode: string): Promise<CellEntity> => {
  return await cellRepository
    .createQueryBuilder('cell')
    .leftJoinAndSelect('BS_BLOCK', 'block', 'block.BLOCK_CODE = cell.BLOCK_CODE')
    .where('cell.ROWGUID = :cellID', { cellID })
    .andWhere('block.WAREHOUSE_CODE = :warehouseCode', { warehouseCode })
    .select([
      'cell.TIER_ORDERED as TIER_ORDERED',
      'cell.SLOT_ORDERED as SLOT_ORDERED',
      'cell.CELL_WIDTH as CELL_WIDTH',
      'cell.CELL_HEIGHT as CELL_HEIGHT',
      'cell.CELL_LENGTH as CELL_LENGTH',
      'cell.STATUS as STATUS',
      'block.WAREHOUSE_CODE as WAREHOUSE_CODE',
      'block.BLOCK_CODE as BLOCK_CODE',
      'block.BLOCK_NAME as BLOCK_NAME',
    ])
    .getRawOne();
};

const findCellById = async (cellID: string): Promise<CellEntity> => {
  return await cellRepository
    .createQueryBuilder('cell')
    .where('cell.ROWGUID = :cellID', { cellID })
    .getOne();
};

const updateNewCellStatus = async (cellID: string) => {
  return await cellRepository
    .createQueryBuilder('cell')
    .update(CellEntity)
    .set({
      STATUS: 1,
    })
    .where('ROWGUID = :cellID', { cellID })
    .execute();
};

const updateNewCellStatusTransaction = async (
  transactionalEntityManager: EntityManager,
  cellID: string,
) => {
  return await transactionalEntityManager
    .createQueryBuilder(CellEntity, 'cell')
    .update(CellEntity)
    .set({
      STATUS: 1,
    })
    .where('ROWGUID = :cellID', { cellID });
};

const updateOldCellStatus = async (cellID: string) => {
  return await cellRepository
    .createQueryBuilder('cell')
    .update(CellEntity)
    .set({
      STATUS: 0,
    })
    .where('ROWGUID = :cellID', { cellID })
    .execute();
};

const findCellByWarehouseCode = async (warehouseCode: string): Promise<CellEntity[]> => {
  return await cellRepository
    .createQueryBuilder('cell')
    .leftJoinAndSelect('BS_BLOCK', 'block', 'block.BLOCK_CODE = cell.BLOCK_CODE')
    .where('block.WAREHOUSE_CODE = :warehouseCode', { warehouseCode })
    .andWhere('cell.STATUS = 0')
    .select([
      'cell.ROWGUID as ROWGUID',
      'cell.CELL_WIDTH as CELL_WIDTH',
      'cell.CELL_HEIGHT as CELL_HEIGHT',
      'cell.CELL_LENGTH as CELL_LENGTH',
      'cell.TIER_ORDERED as TIER_ORDERED',
      'cell.STATUS as STATUS',
      'block.WAREHOUSE_CODE as WAREHOUSE_CODE',
      'block.BLOCK_CODE as BLOCK_CODE',
      'block.BLOCK_NAME as BLOCK_NAME',
    ])
    .orderBy('cell.TIER_ORDERED', 'ASC')
    .orderBy('cell.SLOT_ORDERED', 'ASC')
    .getRawMany();
};

const getAllAvailableCell = async ({
  palletLength,
  palletWidth,
  palletHeight,
}: {
  palletHeight: number;
  palletWidth: number;
  palletLength: number;
}) => {
  const maxCellDimention = await cellRepository
    .createQueryBuilder('cell')
    .where('cell.STATUS = 0')
    .andWhere('cell.CELL_HEIGHT >= :palletHeight', { palletHeight })
    .andWhere('cell.CELL_WIDTH >= :palletWidth', { palletWidth })
    .andWhere('cell.CELL_LENGTH >= :palletLength', { palletLength })
    .select('cell.ROWGUID', 'ROWGUID')
    .addSelect('cell.CELL_WIDTH', 'CELL_WIDTH')
    .addSelect('cell.CELL_HEIGHT', 'CELL_HEIGHT')
    .addSelect('cell.CELL_LENGTH', 'CELL_LENGTH')
    .addSelect('cell.BLOCK_CODE', 'BLOCK_CODE')
    .getRawMany();
  return maxCellDimention;
};

export {
  findCellInWarehouse,
  updateNewCellStatus,
  findCellById,
  updateOldCellStatus,
  findCellByWarehouseCode,
  getAllAvailableCell,
  updateNewCellStatusTransaction,
};
