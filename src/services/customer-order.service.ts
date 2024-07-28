import { ERROR_MESSAGE } from '../constants';
import { BadRequestError } from '../core/error.response';
import { DeliverOrderEntity } from '../entity/deliver-order.entity';
import { JobQuantityCheckEntity } from '../entity/job-quantity-check.entity';
import { PalletStockEntity } from '../entity/pallet-stock.entity';
import { User } from '../entity/user.entity';
import {
  DeliverOrder,
  ExportedOrder,
  ExportedOrderStatus,
  ImportedOrder,
  ImportedOrderStatus,
} from '../models/deliver-order.model';
import { findCustomerByUserId } from '../repositories/customer.repo';
import {
  findExportedOrdersByStatus,
  findImportedOrdersByStatus,
  findOrdersByCustomerCode,
} from '../repositories/order.repo';

class CustomerOrderService {
  static getOrdersByCustomerCode = async (user: User): Promise<DeliverOrder[]> => {
    const customer = await findCustomerByUserId(user.ROWGUID);

    if (!customer) {
      throw new BadRequestError(ERROR_MESSAGE.CUSTOMER_NOT_EXIST);
    }

    const customerCode = customer.CUSTOMER_CODE;
    const orders = await findOrdersByCustomerCode(customerCode);

    if (orders.length) {
      return orders;
    }

    return [];
  };

  static getImportedOrdersByStatus = async (
    status: string,
    user: User,
  ): Promise<ImportedOrder[]> => {
    const customer = await findCustomerByUserId(user.ROWGUID);
    const orders = await findImportedOrdersByStatus(customer.CUSTOMER_CODE);

    const processOrder = (order: any): ImportedOrder => {
      let orderStatus: ImportedOrderStatus;
      if (order.TOTAL_PACKAGES === order.TOTAL_JOBS) {
        if (order.TOTAL_PALLETS === order.STORED_PALLETS) {
          orderStatus = ImportedOrderStatus.isStored;
        } else if (order.TOTAL_JOBS === order.CHECKED_JOBS) {
          orderStatus = ImportedOrderStatus.isChecked;
        } else {
          orderStatus = ImportedOrderStatus.isConfirmed;
        }
      } else {
        orderStatus = ImportedOrderStatus.isConfirmed;
      }

      return {
        DE_ORDER_NO: order.DE_ORDER_NO,
        CUSTOMER_CODE: order.CUSTOMER_CODE,
        CONTAINER_ID: order.CONTAINER_ID,
        PACKAGE_ID: order.DO_PACKAGE_ID,
        INV_ID: order.INV_ID,
        ISSUE_DATE: order.ISSUE_DATE,
        EXP_DATE: order.EXP_DATE,
        TOTAL_CBM: order.TOTAL_CBM,
        JOB_CHK: order.JOB_CHK,
        NOTE: order.NOTE,
        status: orderStatus,
      };
    };

    const processedOrders = orders.map(processOrder);
    return processedOrders.filter(order => order.status === status);
  };

  static getExportedOrdersByStatus = async (
    status: string,
    user: User,
  ): Promise<ExportedOrder[]> => {
    const customer = await findCustomerByUserId(user.ROWGUID);
    const orders = await findExportedOrdersByStatus(customer.CUSTOMER_CODE);

    const processOrder = (order: any): ExportedOrder => {
      let orderStatus: ExportedOrderStatus;
      if (
        order.TOTAL_JOBS === order.TOTAL_PALLETS &&
        order.TOTAL_PALLETS === order.RELEASED_PALLETS
      ) {
        orderStatus = ExportedOrderStatus.isReleased;
      } else {
        orderStatus = ExportedOrderStatus.isConfirmed;
      }

      return {
        DE_ORDER_NO: order.DE_ORDER_NO,
        CUSTOMER_CODE: order.CUSTOMER_CODE,
        CONTAINER_ID: order.CONTAINER_ID,
        PACKAGE_ID: order.PACKAGE_ID,
        INV_ID: order.INV_ID,
        ISSUE_DATE: order.ISSUE_DATE,
        EXP_DATE: order.EXP_DATE,
        TOTAL_CBM: order.TOTAL_CBM,
        JOB_CHK: order.JOB_CHK,
        NOTE: order.NOTE,
        status: orderStatus,
      };
    };

    const processedOrders = orders.map(processOrder);
    return processedOrders.filter(order => order.status === status);
  };
}

export default CustomerOrderService;
