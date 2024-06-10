import mssqlConnection from '../db/mssql.connect';
import { Block as BlockEntity } from '../entity/block.entity';
import { Cell as CellEntity } from '../entity/cell.entity';
import { Block } from '../models/block.model';
import { warehouseRepository } from './warehouse.repo';
import { Cell } from '../models/cell.model';
import { boolean } from 'joi';

export const blockRepository = mssqlConnection.getRepository(BlockEntity);
export const cellRepository = mssqlConnection.getRepository(CellEntity);

const checkDuplicateBlock = async (warehouseCode: string, blockName: string) => {
  return await blockRepository
    .createQueryBuilder('block')
    .where('block.WAREHOUSE_CODE = :warehouseCode', { warehouseCode: warehouseCode })
    .andWhere('block.BLOCK_NAME = :blockName', { blockName: blockName })
    .getOne();
};

const createBlockandCell = async (blockListInfo: Block[], statusCreateBlock: boolean = true) => {
  let arrayCell: Cell[] = [];
  for (let i = 0; i < blockListInfo.length; i++) {
    let blockInfo = blockListInfo[i];
    for (let j = 0; j < blockInfo.SLOT_COUNT; j++) {
      for (let o = 0; o < blockInfo.TIER_COUNT; o++) {
        arrayCell.push({
          WAREHOUSE_CODE: blockInfo.WAREHOUSE_CODE,
          BLOCK_CODE: blockInfo.BLOCK_CODE,
          TIER_ORDERED: o,
          SLOT_ORDERED: j,
          STATUS: 0,
          CREATE_BY: blockInfo.CREATE_BY,
          CREATE_DATE: blockInfo.CREATE_DATE,
          UPDATE_BY: blockInfo.UPDATE_BY,
          UPDATE_DATE: blockInfo.UPDATE_DATE
        })
      }
    }
  }
  await cellRepository.save(arrayCell);
  if (statusCreateBlock) {
    const newBlock = await blockRepository.save(blockListInfo);
    return newBlock;
  }
  return [];
}

const checkCellStatus = async (blockListID: string[]) => {
  const cellArrStatus = await cellRepository
    .createQueryBuilder()
    .select(["BLOCK_CODE","WAREHOUSE_CODE"])
    .where("BLOCK_CODE IN (:...ids)", { ids: blockListID })
    .getMany();

  return cellArrStatus;
}

const deleteBlockMany = async (blockListId: string[], statusDeleteBlock: boolean = true) => {
  if (statusDeleteBlock) {
    await blockRepository.delete(blockListId);
  }
  await cellRepository
    .createQueryBuilder()
    .delete()
    .where("BLOCK_CODE IN (...ids)", { ids: blockListId })
    .from('BS_CELL')
    .execute();
  return true;
};

const updateBlock = async (blockListInfo: Block[]) => {
  let blockCode = blockListInfo.map(e => e.BLOCK_CODE);
  await deleteBlockMany(blockCode, false);
  await createBlockandCell(blockListInfo, false);
  return await Promise.all(blockListInfo.map(block => blockRepository.update(block.BLOCK_CODE, block)));
};

const getAllBlock = async () => {
  return await blockRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const isValidWarehouseCode = async (warehouseCode: string) => {
  return await warehouseRepository
    .createQueryBuilder('wh')
    .where('wh.WAREHOUSE_CODE = :warehouseCode', { warehouseCode: warehouseCode })
    .getOne();
};

const getAllCell = async () => {
  return await cellRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
}

export {
  createBlockandCell,
  checkDuplicateBlock,
  deleteBlockMany,
  getAllBlock,
  checkCellStatus,
  isValidWarehouseCode,
  updateBlock,
  getAllCell
};
