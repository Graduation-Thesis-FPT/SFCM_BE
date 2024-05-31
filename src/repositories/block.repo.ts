import mssqlConnection from '../db/mssql.connect';
import { Block as BlockEntity } from '../entity/block.entity';
import { isValidInfor } from '../utils';

export const blockRepository = mssqlConnection.getRepository(BlockEntity);

const createBlock = async (blockListInfo: BlockEntity[]) => {
  const block = blockRepository.create(blockListInfo);

  await isValidInfor(block);

  const newBlock = await blockRepository.save(block);
  return newBlock;
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
  return await blockRepository.find();
};

const findBlockById = async (blockId: string) => {
  return await blockRepository
    .createQueryBuilder('block')
    .where('block.ROWGUID = :blockId', { blockId: blockId })
    .getOne();
};

const findBlockByWarehouseCode = async (warehouseCode: string) => {
  return await blockRepository
    .createQueryBuilder('block')
    .where('block.WAREHOUSE_CODE = :warehouseCode', { warehouseCode: warehouseCode })
    .getOne();
};

export {
  createBlock,
  checkDuplicateBlock,
  deleteBlockMany,
  getAllBlock,
  findBlockById,
  findBlockByWarehouseCode,
};
