import mssqlConnection from '../db/mssql.connect';
import { Block as BlockEntity } from '../entity/block.entity';
import { Block } from '../models/block.model';
import { warehouseRepository } from './warehouse.repo';

export const blockRepository = mssqlConnection.getRepository(BlockEntity);

const createBlock = async (blockListInfo: Block[]) => {
  const block = blockRepository.create(blockListInfo);

  const newBlock = await blockRepository.save(block);
  return newBlock;
};

const updateBlock = async (blockListInfo: Block[]) => {
  return await Promise.all(
    blockListInfo.map(block => blockRepository.update(block.ROWGUID, block)),
  );
};

const checkDuplicateBlock = async (warehouseCode: string, blockName: string) => {
  return await blockRepository
    .createQueryBuilder('block')
    .where('block.WAREHOUSE_CODE = :warehouseCode', { warehouseCode: warehouseCode })
    .andWhere('block.BLOCK_NAME = :blockName', { blockName: blockName })
    .getOne();
};

const deleteBlockMany = async (blockListId: string[]) => {
  return await blockRepository.delete(blockListId);
};

const getAllBlock = async () => {
  return await blockRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const findBlockById = async (blockId: string) => {
  return await blockRepository
    .createQueryBuilder('block')
    .where('block.ROWGUID = :blockId', { blockId: blockId })
    .getOne();
};

const isValidWarehouseCode = async (warehouseCode: string) => {
  return await warehouseRepository
    .createQueryBuilder('wh')
    .where('wh.WAREHOUSE_CODE = :warehouseCode', { warehouseCode: warehouseCode })
    .getOne();
};

export {
  createBlock,
  checkDuplicateBlock,
  deleteBlockMany,
  getAllBlock,
  findBlockById,
  isValidWarehouseCode,
  updateBlock,
};
