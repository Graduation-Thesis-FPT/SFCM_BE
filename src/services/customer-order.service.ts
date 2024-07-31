import { ERROR_MESSAGE } from '../constants';
import { BadRequestError } from '../core/error.response';
import { User } from '../entity/user.entity';
import { Container } from '../models/container.model';
import { Customer } from '../models/customer.model';
import {
  DeliverOrder,
  ExportedOrderStatus,
  ExtendedDeliveryOrder,
  ExtendedExportedOrder,
  ExtendedImportedOrder,
  ImportedOrderStatus,
} from '../models/deliver-order.model';
import { Package } from '../models/packageMnfLd.model';
import { findContainer } from '../repositories/container.repo';
import { findCustomer, findCustomerByUserId } from '../repositories/customer.repo';
import { findOrderDetailsByOrderNo } from '../repositories/order-detail.repo';
import {
  findExportedOrdersByStatus,
  findImportedOrdersByStatus,
  findOrderByOrderNo,
  findOrdersByCustomerCode,
} from '../repositories/order.repo';
import { findPackage } from '../repositories/package.repo';

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
  ): Promise<ExtendedImportedOrder[]> => {
    const customer = await findCustomerByUserId(user.ROWGUID);
    if (!customer) {
      throw new BadRequestError(ERROR_MESSAGE.CUSTOMER_NOT_EXIST);
    }
    const orders = await findImportedOrdersByStatus(customer.CUSTOMER_CODE);

    const processOrder = async (order: any): Promise<ExtendedImportedOrder> => {
      let orderStatus: ImportedOrderStatus;
      if (order.TOTAL_PACKAGES === order.TOTAL_JOBS_BY_PACKAGE) {
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
      const orderDetails = await findOrderDetailsByOrderNo(order.DE_ORDER_NO);
      let containerInfo: Container = await findContainer(order.CONTAINER_ID);

      if (!containerInfo) {
        containerInfo = {
          CREATE_BY: '',
          CREATE_DATE: new Date(),
          UPDATE_BY: '',
          UPDATE_DATE: new Date(),
          ROWGUID: '',
          VOYAGEKEY: '',
          BILLOFLADING: '',
          SEALNO: '',
          CNTRNO: '',
          CNTRSZTP: '',
          STATUSOFGOOD: false,
          ITEM_TYPE_CODE: '',
          COMMODITYDESCRIPTION: '',
          CONSIGNEE: '',
        };
      }
      let customerInfo: Customer = await findCustomer(order.CUSTOMER_CODE);
      if (!customerInfo) {
        customerInfo = {
          CUSTOMER_CODE: '',
          CUSTOMER_NAME: '',
          CUSTOMER_TYPE_CODE: '',
          USER_ID: '',
          ADDRESS: '',
          EMAIL: '',
          TAX_CODE: '',
          IS_ACTIVE: false,
          CREATE_BY: '',
          CREATE_DATE: new Date(),
          UPDATE_BY: '',
          UPDATE_DATE: new Date(),
        };
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
        orderDetails,
        containerInfo,
        customerInfo,
      };
    };

    const processedOrders = await Promise.all(orders.map(processOrder));
    return processedOrders.filter(order => order.status === status);
  };

  static getExportedOrdersByStatus = async (
    status: string,
    user: User,
  ): Promise<ExtendedExportedOrder[]> => {
    const customer = await findCustomerByUserId(user.ROWGUID ?? '');
    const orders = await findExportedOrdersByStatus(customer.CUSTOMER_CODE ?? '');

    const processOrder = async (order: any): Promise<ExtendedExportedOrder> => {
      let orderStatus: ExportedOrderStatus;
      if (
        order.TOTAL_JOBS === order.TOTAL_PALLETS &&
        order.TOTAL_PALLETS === order.RELEASED_PALLETS
      ) {
        orderStatus = ExportedOrderStatus.isReleased;
      } else {
        orderStatus = ExportedOrderStatus.isConfirmed;
      }
      let containerInfo: Container = await findContainer(order.CONTAINER_ID);

      if (!containerInfo) {
        containerInfo = {
          CREATE_BY: '',
          CREATE_DATE: new Date(),
          UPDATE_BY: '',
          UPDATE_DATE: new Date(),
          ROWGUID: '',
          VOYAGEKEY: '',
          BILLOFLADING: '',
          SEALNO: '',
          CNTRNO: '',
          CNTRSZTP: '',
          STATUSOFGOOD: false,
          ITEM_TYPE_CODE: '',
          COMMODITYDESCRIPTION: '',
          CONSIGNEE: '',
        };
      }
      let customerInfo: Customer = await findCustomer(order.CUSTOMER_CODE);
      if (!customerInfo) {
        customerInfo = {
          CUSTOMER_CODE: '',
          CUSTOMER_NAME: '',
          CUSTOMER_TYPE_CODE: '',
          USER_ID: '',
          ADDRESS: '',
          EMAIL: '',
          TAX_CODE: '',
          IS_ACTIVE: false,
          CREATE_BY: '',
          CREATE_DATE: new Date(),
          UPDATE_BY: '',
          UPDATE_DATE: new Date(),
        };
      }
      const packageInfo = await findPackage(order.PACKAGE_ID);
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
        containerInfo,
        packageInfo,
        customerInfo,
      };
    };

    const processedOrders = await Promise.all(orders.map(processOrder));
    return processedOrders.filter(order => order.status === status);
  };
  static getOrderByOrderNo = async (orderNo: string): Promise<ExtendedDeliveryOrder> => {
    const order = await findOrderByOrderNo(orderNo);

    if (!order) {
      throw new BadRequestError(ERROR_MESSAGE.ORDER_NOT_EXIST);
    }
    const orderDetails = await findOrderDetailsByOrderNo(orderNo);
    let containerInfo: Container = await findContainer(order.CONTAINER_ID);

    if (!containerInfo) {
      containerInfo = {
        CREATE_BY: '',
        CREATE_DATE: new Date(),
        UPDATE_BY: '',
        UPDATE_DATE: new Date(),
        ROWGUID: '',
        VOYAGEKEY: '',
        BILLOFLADING: '',
        SEALNO: '',
        CNTRNO: '',
        CNTRSZTP: '',
        STATUSOFGOOD: false,
        ITEM_TYPE_CODE: '',
        COMMODITYDESCRIPTION: '',
        CONSIGNEE: '',
      };
    }
    let customerInfo: Customer = await findCustomer(order.CUSTOMER_CODE);
    if (!customerInfo) {
      customerInfo = {
        CUSTOMER_CODE: '',
        CUSTOMER_NAME: '',
        CUSTOMER_TYPE_CODE: '',
        USER_ID: '',
        ADDRESS: '',
        EMAIL: '',
        TAX_CODE: '',
        IS_ACTIVE: false,
        CREATE_BY: '',
        CREATE_DATE: new Date(),
        UPDATE_BY: '',
        UPDATE_DATE: new Date(),
      };
    }
    let packageInfo: Package = await findPackage(order.PACKAGE_ID);
    if (!packageInfo) {
      packageInfo = {
        ROWGUID: '',
        HOUSE_BILL: '',
        ITEM_TYPE_CODE: '',
        PACKAGE_UNIT_CODE: '',
        CARGO_PIECE: 0,
        CBM: 0,
        DECLARE_NO: '',
        CONTAINER_ID: '',
        NOTE: '',
        ITEM_TYPE_CODE_CNTR: '',
        CUSTOMER_CODE: '',
        TIME_IN: new Date(),
        TIME_OUT: new Date(),
        CREATE_BY: '',
        CREATE_DATE: new Date(),
        UPDATE_BY: '',
        UPDATE_DATE: new Date(),
      };
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
      orderDetails,
      containerInfo,
      customerInfo,
      packageInfo,
    };
  };
}

export default CustomerOrderService;
