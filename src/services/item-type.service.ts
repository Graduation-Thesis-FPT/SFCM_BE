import { BadRequestError } from '../core/error.response';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import {
  getItemType,
  deleteItemtype,
  createitemType,
  updateitemType,
  findItemType,
} from '../repositories/item-type.repo';
import { ItemTypeInfo } from '../models/item-type.model';

class ItemTypeService {
  static createAndUpdateItemType = async (itemTypeListInfo: ItemTypeInfo, createBy: User) => {
    const insertData = itemTypeListInfo.insert;
    const updateData = itemTypeListInfo.update;

    let createdItemType;
    let updatedItemType;
    if (insertData.length) {
      for (const data of insertData) {
        const checkExist = await findItemType(data.ITEM_TYPE_CODE);

        if (checkExist) {
          throw new BadRequestError(ERROR_MESSAGE.ITEM_TYPE_EXIST);
        }
        data.CREATE_BY = createBy.ROWGUID;
        data.UPDATE_BY = createBy.ROWGUID;
        data.UPDATE_DATE = new Date();
        data.CREATE_DATE = new Date();
      }
      createdItemType = await createitemType(insertData);
    }

    if (updateData.length) {
      for (const data of updateData) {
        const checkExist = await findItemType(data.ITEM_TYPE_CODE);

        if (!checkExist) {
          throw new BadRequestError(ERROR_MESSAGE.ITEM_TYPE_EXIST);
        }
        data.CREATE_BY = createBy.ROWGUID;
        data.UPDATE_BY = createBy.ROWGUID;
        data.UPDATE_DATE = new Date();
        data.CREATE_DATE = new Date();
      }
      updatedItemType = await updateitemType(updateData);
    }
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
