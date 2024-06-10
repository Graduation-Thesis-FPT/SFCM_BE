import mssqlConnection from '../db/mssql.connect';
import { Cell as CellEntity } from '../entity/cell.entity';
import { Cell } from '../models/block.model';
import { warehouseRepository } from './warehouse.repo';

export const cellRepository = mssqlConnection.getRepository(CellEntity);

const createCell = async (cellListInfo: Cell[]) => {
  const cell = cellRepository.create(cellListInfo);

  const newCell = await cellRepository.save(cell);
  return newCell;
};

const updateCell = async (cellListInfo: Cell[]) => {
  return await Promise.all(cellListInfo.map(block => cellRepository.update(block.ROWGUID, block)));
};

const checkDuplicateCell = async (warehouseCode: string, blockCode: string) => {
  return await cellRepository
    .createQueryBuilder('block')
    .where('block.WAREHOUSE_CODE = :warehouseCode', { warehouseCode: warehouseCode })
    .andWhere('block.BLOCK_CODE = :blockCode', { blockCode: blockCode })
    .getOne();
};

const deleteCellMany = async (cellListId: string[]) => {
  return await cellRepository.delete(cellListId);
};

const getAllCell = async () => {
  return await cellRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const findCellById = async (cellId: string) => {
  return await cellRepository
    .createQueryBuilder('cell')
    .where('cell.ROWGUID = :cellId', { cellId: cellId })
    .getOne();
};

const isValidWarehouseCode = async (warehouseCode: string) => {
  return await warehouseRepository
    .createQueryBuilder('wh')
    .where('wh.WAREHOUSE_CODE = :warehouseCode', { warehouseCode: warehouseCode })
    .getOne();
};

export {
  createCell,
  checkDuplicateCell,
  deleteCellMany,
  getAllCell,
  findCellById,
  isValidWarehouseCode,
  updateCell,
};
