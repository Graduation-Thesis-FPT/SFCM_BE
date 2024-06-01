import { BadRequestError } from '../core/error.response';
import { isValidID } from '../utils';
import { ERROR_MESSAGE } from '../constants';
import { User } from '../entity/user.entity';
import { findWarehouseByCode, getAllWarehouse, deleteWarehose, createWarehouse } from '../repositories/warehouse.repo';
import { WareHouse } from '../entity/warehouse.entity';


class WarehouseService {
    static createAndUpdateWarehouse = async (warehouseListInfo: WareHouse[], createBy: User) => {
        // let updateDataList = warehouseListInfo.filter((e: any) => e['status'] == 'edit');
        // let insertDataList = warehouseListInfo.filter((e: any) => e['status'] == 'add');

        // for (const insertData of insertDataList) {
        //     delete insertData['status'];
        //     const warehouse = await findWarehouseByCode(insertData.WAREHOUSE_CODE);

        //     if (warehouse) {
        //     } else {
        //         throw new BadRequestError(ERROR_MESSAGE.INVALID_WAREHOUSE_CODE);
        //     }
        // }
        for (const warehouseInfo of warehouseListInfo) {
            const warehouse = await findWarehouseByCode(warehouseInfo.WAREHOUSE_CODE);

            if (warehouse) {
                throw new BadRequestError(
                    `Không thể thêm kho ${warehouseInfo.WAREHOUSE_NAME} (Đã tồn tại)`,
                );
            }
            warehouseInfo.CREATE_BY = createBy.ROWGUID;
            warehouseInfo.UPDATE_BY = createBy.ROWGUID;
            warehouseInfo.UPDATE_DATE = new Date();
            warehouseInfo.STATUS = false;
        }
        const newWarehouse = await createWarehouse(warehouseListInfo);
        return newWarehouse;
    }

    static deleteWarehouse = async (warehouseCodeList: string[]) => {
        for (const warehouseCode of warehouseCodeList) {

            const warehouse = await findWarehouseByCode(warehouseCode);
            if (!warehouse) {
                throw new BadRequestError(`Warehouse with ID ${warehouse.WAREHOUSE_CODE} not exist!`);
            }

            if (warehouse.STATUS) {
                throw new BadRequestError(
                    `Không thể xóa kho ${warehouse.WAREHOUSE_NAME} : tồn tại hàng hóa!`,
                );
            }
        }

        return await deleteWarehose(warehouseCodeList);
    }

    static getAllWarehouse = async () => {
        return await getAllWarehouse();
    };
}
export default WarehouseService;

