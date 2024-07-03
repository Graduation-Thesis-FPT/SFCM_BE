import { EntityManager } from 'typeorm';
import mssqlConnection from '../db/mssql.connect';
import { ItemType as ItemTypeEntity } from '../entity/item-type.entity';
import { ItemType } from '../models/item-type.model';

export const itemTypeRepository = mssqlConnection.getRepository(ItemTypeEntity);

const getItemType = async () => {
  return await itemTypeRepository.find({
    order: {
      UPDATE_DATE: 'DESC',
    },
  });
};

const deleteItemtype = async (itemTypeListId: string[]) => {
  return await itemTypeRepository.delete(itemTypeListId);
};

const findItemTypeByCode = async (
  ITEM_TYPE_CODE: string,
  transactionEntityManager: EntityManager,
) => {
  return await transactionEntityManager
    .createQueryBuilder(ItemTypeEntity, 'item')
    .where('item.ITEM_TYPE_CODE = :ITEM_TYPE_CODE', { ITEM_TYPE_CODE: ITEM_TYPE_CODE })
    .getOne();
};

const createItemType = async (
  itemTypeList: ItemType[],
  transactionEntityManager: EntityManager,
) => {
  const itemType = itemTypeRepository.create(itemTypeList);
  const newitemType = await transactionEntityManager.save(itemType);
  return newitemType;
};

const updateItemType = async (
  itemTypeList: ItemType[],
  transactionEntityManager: EntityManager,
) => {
  for await (const data of itemTypeList) {
    await transactionEntityManager.update(ItemTypeEntity, data.ITEM_TYPE_CODE, data);
  }
  return true;
};

const findItemType = async (ITEM_TYPE_CODE: string) => {
  return await itemTypeRepository
    .createQueryBuilder('item')
    .where('item.ITEM_TYPE_CODE = :ITEM_TYPE_CODE', { ITEM_TYPE_CODE: ITEM_TYPE_CODE })
    .getOne();
};

export {
  getItemType,
  deleteItemtype,
  findItemTypeByCode,
  createItemType,
  updateItemType,
  findItemType,
};
