import mssqlConnection from '../dbs/mssql.connect';
import { DeliveryOrderDtlEntity } from '../entity/delivery-order-detail.entity';

const orderDtlRepository = mssqlConnection.getRepository(DeliveryOrderDtlEntity);

const findOrderDetailsByOrderNo = async (orderNo: string): Promise<any[]> => {
  try {
    const result = await orderDtlRepository
      .createQueryBuilder('orderDtl')
      .leftJoinAndSelect('DT_PACKAGE_MNF_LD', 'pk', 'pk.ROWGUID = orderDtl.REF_PAKAGE')
      .leftJoinAndSelect('BS_ITEM_TYPE', 'item', 'pk.ITEM_TYPE_CODE = item.ITEM_TYPE_CODE')
      .where('orderDtl.DE_ORDER_NO = :orderNo', { orderNo })
      .select([
        'orderDtl.ROWGUID as ROWGUID',
        'orderDtl.DE_ORDER_NO as DE_ORDER_NO',
        'orderDtl.METHOD_CODE as METHOD_CODE',
        'orderDtl.HOUSE_BILL as HOUSE_BILL',
        'orderDtl.CBM as CBM',
        'orderDtl.LOT_NO as LOT_NO',
        'orderDtl.REF_PAKAGE as REF_PAKAGE',
        'pk.PACKAGE_UNIT_CODE as PACKAGE_UNIT_CODE',
        'pk.ITEM_TYPE_CODE as ITEM_TYPE_CODE',
        'pk.CONTAINER_ID as CONTAINER_ID',
        'pk.DECLARE_NO as PK_DECLARE_NO',
        'pk.CARGO_PIECE as PK_CARGO_PIECE',
        'pk.NOTE as PK_NOTE',
        'item.ITEM_TYPE_NAME as ITEM_TYPE_NAME',
      ])
      .orderBy('orderDtl.LOT_NO', 'ASC')
      .getRawMany();

    return result;
  } catch (error) {
    console.error('Error in findOrderDetailsByOrderNo:', error);
    throw error;
  }
};

export { findOrderDetailsByOrderNo };
