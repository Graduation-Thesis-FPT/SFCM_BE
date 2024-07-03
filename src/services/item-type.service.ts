import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import {
  getItemType,
  deleteItemtype,
  findItemType,
  findItemTypeByCode,
  createItemType,
  updateItemType,
} from '../repositories/item-type.repo';
import { ItemTypeInfo } from '../models/item-type.model';
import { manager } from '../repositories/index.repo';

class ItemTypeService {
  static createAndUpdateItemType = async (itemTypeListInfo: ItemTypeInfo, createBy: User) => {
    const insertData = itemTypeListInfo.insert;
    const updateData = itemTypeListInfo.update;

    let createdItemType;
    let updatedItemType;
    await manager.transaction(async transactionEntityManager => {
      if (insertData.length) {
        for (const data of insertData) {
          const checkExist = await findItemTypeByCode(
            data.ITEM_TYPE_CODE,
            transactionEntityManager,
          );

          if (checkExist) {
            throw new BadRequestError(`Mã loại hàng hóa ${data.ITEM_TYPE_CODE} đã tồn tại`);
          }
          data.CREATE_BY = createBy.ROWGUID;
          data.UPDATE_BY = createBy.ROWGUID;
          data.UPDATE_DATE = new Date();
          data.CREATE_DATE = new Date();
        }
        createdItemType = await createItemType(insertData, transactionEntityManager);
      }

      if (updateData.length) {
        for (const data of updateData) {
          const checkExist = await findItemTypeByCode(
            data.ITEM_TYPE_CODE,
            transactionEntityManager,
          );

          if (!checkExist) {
            throw new BadRequestError(`Mã loại hàng hóa ${data.ITEM_TYPE_CODE} không tồn tại`);
          }
          data.UPDATE_BY = createBy.ROWGUID;
          data.UPDATE_DATE = new Date();
        }
        updatedItemType = await updateItemType(updateData, transactionEntityManager);
      }
    });
    return {
      createdItemType,
      updatedItemType,
    };
  };

  static deleteItemType = async (ItemTypeCodeList: string[]) => {
    for (const ItemTypeCode of ItemTypeCodeList) {
      const ItemType = await findItemType(ItemTypeCode);
      if (!ItemType) {
        throw new BadRequestError(`ItemType with ID ${ItemType.ITEM_TYPE_CODE} not exist!`);
      }
    }

    return await deleteItemtype(ItemTypeCodeList);
  };

  static getAllItemType = async () => {
    return await getItemType();
  };
}
export default ItemTypeService;
