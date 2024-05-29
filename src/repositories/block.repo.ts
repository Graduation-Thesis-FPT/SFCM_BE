import mssqlConnection from '../db/mssql.connect';
import { Block as BlockEntity } from '../entity/block.entity';
import { User } from '../entity/user.entity';
import { isValidInfor } from '../utils';

export const blockRepository = mssqlConnection.getRepository(BlockEntity);

const createBlock = async (blockInfo: BlockEntity, createBy: User) => {
  blockInfo.CREATE_BY = createBy.ROWGUID;
  blockInfo.UPDATE_BY = createBy.ROWGUID;
  blockInfo.UPDATE_DATE = new Date();
  blockInfo.STATUS = false;

  const block = blockRepository.create(blockInfo);

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

export { createBlock, checkDuplicateBlock, deleteBlockMany, getAllBlock, findBlockById };
