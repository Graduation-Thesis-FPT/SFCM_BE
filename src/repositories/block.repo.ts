import mssqlConnection from '../db/mssql.connect';
import { Block as BlockEntity } from '../entity/block.entity';
import { Cell as CellEntity } from '../entity/cell.entity';
import { Block } from '../models/block.model';
import { warehouseRepository } from './warehouse.repo';
import { Cell } from '../models/cell.model';
import { boolean } from 'joi';
import { EntityManager } from 'typeorm';

export const blockRepository = mssqlConnection.getRepository(BlockEntity);
export const cellRepository = mssqlConnection.getRepository(CellEntity);

const checkDuplicateBlock = async (BLOCK_CODE: string) => {
  return await blockRepository
    .createQueryBuilder('block')
    .where('block.BLOCK_CODE = :blockCode', { blockCode: BLOCK_CODE })
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
          TIER_ORDERED: o + 1,
          SLOT_ORDERED: j + 1,
          STATUS: 0,
          CELL_LENGTH: 1,
          CELL_WIDTH: 2,
          CELL_HEIGHT: 3,
          CREATE_BY: blockInfo.CREATE_BY,
          CREATE_DATE: blockInfo.CREATE_DATE,
          UPDATE_BY: blockInfo.UPDATE_BY,
          UPDATE_DATE: blockInfo.UPDATE_DATE,
        });
      }
    }
  }

  let newBlock: Block[] = [];
  if (statusCreateBlock) {
    newBlock = await blockRepository.save(blockListInfo);
  }
  await cellRepository.save(arrayCell);
  return newBlock;
};

const checkCellStatus = async (blockListID: string[]) => {
  const cellArrStatus = await cellRepository
    .createQueryBuilder('cell')
    .select(['cell.BLOCK_CODE', 'cell.WAREHOUSE_CODE'])
    .where('BLOCK_CODE IN (:...ids)', { ids: blockListID })
    .where('STATUS =:status', { status: 1 })
    .getMany();

  return cellArrStatus;
};

const deleteBlockMany = async (blockListId: string[], statusDeleteBlock: boolean = true) => {
  await cellRepository
    .createQueryBuilder()
    .delete()
    .where('BLOCK_CODE IN (:...ids)', { ids: blockListId })
    .from('BS_CELL')
    .execute();
  if (statusDeleteBlock) {
    await blockRepository.delete(blockListId);
  }
  return true;
};

const updateBlock = async (blockListInfo: Block[]) => {
  let blockCode = blockListInfo.map(e => e.BLOCK_CODE);
  await deleteBlockMany(blockCode, false);
  await createBlockandCell(blockListInfo, false);
  return await Promise.all(
    blockListInfo.map(block => blockRepository.update(block.BLOCK_CODE, block)),
  );
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

const getAllCell = async (WAREHOUSE_CODE: string = '', BLOCK_CODE: string = '') => {
  let whereObj: any = {
    WAREHOUSE_CODE: WAREHOUSE_CODE,
  };
  BLOCK_CODE != 'all' ? (whereObj['BLOCK_CODE'] = BLOCK_CODE) : '';
  return await cellRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
    where: whereObj,
  });
};

const findBlockByCode = async (blockCode: string, transactionEntityManager: EntityManager) => {
  return await transactionEntityManager
    .createQueryBuilder(BlockEntity, 'block')
    .where('block.BLOCK_CODE = :blockCode', { blockCode: blockCode })
    .getOne();
};

export {
  createBlockandCell,
  checkDuplicateBlock,
  deleteBlockMany,
  getAllBlock,
  checkCellStatus,
  isValidWarehouseCode,
  updateBlock,
  getAllCell,
  findBlockByCode,
};
