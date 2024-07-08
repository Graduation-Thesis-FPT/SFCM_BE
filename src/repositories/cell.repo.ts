import mssqlConnection from '../db/mssql.connect';
import { Cell as CellEntity } from '../entity/cell.entity';
const cellRepository = mssqlConnection.getRepository(CellEntity);

const findCell = async (cellID: string, warehouseCode: string): Promise<CellEntity> => {
  return await cellRepository
    .createQueryBuilder('cell')
    .leftJoinAndSelect('BS_BLOCK', 'block', 'block.BLOCK_CODE = cell.BLOCK_CODE')
    .where('cell.ROWGUID = :cellID', { cellID })
    .andWhere('block.WAREHOUSE_CODE = :warehouseCode', { warehouseCode })
    .select([
      'cell.*',
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

export { findCell, updateNewCellStatus, findCellById, updateOldCellStatus };
