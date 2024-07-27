import { stat } from 'fs';
import { ERROR_MESSAGE } from '../constants';
import { BadRequestError } from '../core/error.response';
import { DeliverOrderEntity } from '../entity/deliver-order.entity';
import { PalletStockEntity } from '../entity/pallet-stock.entity';
import { User } from '../entity/user.entity';
import {
  DeliverOrder,
  ExportedOrder,
  ExportedOrderStatus,
  ImportedOrder,
  ImportedOrderStatus,
  OrderType,
} from '../models/deliver-order.model';
import { DeliverOrderDetail } from '../models/delivery-order-detail.model';
import { JobQuantityCheck } from '../models/job-quantity-check.model';
import { PalletModel } from '../models/pallet-stock.model';
import { Pallet } from '../models/pallet.model';
import { findCustomerByUserId } from '../repositories/customer.repo';
import { getAllJobQuantityCheckByPACKAGE_ID } from '../repositories/import-tally.repo';
import { findOrderDetailsByOrderNo } from '../repositories/order-detail.repo';
import { findOrdersByCustomerCode } from '../repositories/order.repo';
import { findPalletsByJob } from '../repositories/pallet.repo';

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

  static getOrderType = (order: DeliverOrderEntity): OrderType => {
    if (order.DE_ORDER_NO.startsWith('NK')) {
      return OrderType.import;
    } else if (order.DE_ORDER_NO.startsWith('XK')) {
      return OrderType.export;
    }
    return OrderType.undefined;
  };

  static getImportedOrders = async (user: User): Promise<DeliverOrderEntity[]> => {
    const customer = await findCustomerByUserId(user.ROWGUID);
    console.log('customer', customer.CUSTOMER_CODE);
    if (!customer) {
      throw new BadRequestError(ERROR_MESSAGE.CUSTOMER_NOT_EXIST);
    }

    const customerCode = customer.CUSTOMER_CODE;
    const orders = await findOrdersByCustomerCode(customerCode);
    // console.log('orders1', orders);
    let importedOrders: DeliverOrderEntity[] = [];

    if (orders.length) {
      for (const order of orders) {
        if (CustomerOrderService.getOrderType(order) === OrderType.import) {
          importedOrders.push(order);
        }
      }
    }
    return importedOrders;
  };

  static getImportedOrdersByStatus = async (
    status: string,
    user: User,
  ): Promise<ImportedOrder[]> => {
    const start_time = new Date().getTime();
    const orders = await CustomerOrderService.getImportedOrders(user);
    const importedOrders: ImportedOrder[] = [];

    if (orders.length) {
      const processOrder = async (order: any) => {
        const orderDetails: DeliverOrderDetail[] = await findOrderDetailsByOrderNo(
          order.DE_ORDER_NO,
        );
        if (!orderDetails.length) {
          throw new BadRequestError(ERROR_MESSAGE.ORDER_DETAIL_NOT_EXIST);
        }

        const jobsPromises = orderDetails.map(orderDetail =>
          getAllJobQuantityCheckByPACKAGE_ID(orderDetail.REF_PAKAGE),
        );
        const jobs: JobQuantityCheck[] = (await Promise.all(jobsPromises)).flat();

        const palletsPromises = jobs.map(job => findPalletsByJob(job.ROWGUID));
        const pallets: PalletModel[] = (await Promise.all(palletsPromises)).flat();

        const uniqueJobPackageIds = new Set(jobs.map(job => job.PACKAGE_ID));
        const uniqueOrderDetailPackageIds = new Set(
          orderDetails.map(orderDetail => orderDetail.REF_PAKAGE),
        );

        let orderStatus: string;
        if (
          uniqueJobPackageIds.size === uniqueOrderDetailPackageIds.size &&
          [...uniqueJobPackageIds].every(id => uniqueOrderDetailPackageIds.has(id))
        ) {
          if (pallets.every(pallet => pallet.PALLET_STATUS === 'S')) {
            orderStatus = ImportedOrderStatus.isStored;
          } else if (jobs.every(job => job.JOB_STATUS === 'C')) {
            orderStatus = ImportedOrderStatus.isChecked;
          } else {
            orderStatus = ImportedOrderStatus.isConfirmed;
          }
        } else {
          orderStatus = ImportedOrderStatus.isConfirmed;
        }

        return { ...order, status: orderStatus };
      };

      const processedOrders = await Promise.all(orders.map(processOrder));

      importedOrders.push(...processedOrders.filter(order => order.status === status));
    }
    console.log('getImportedOrdersByStatus', new Date().getTime() - start_time);
    return importedOrders;
  };

  static getExportedOrders = async (user: User): Promise<DeliverOrderEntity[]> => {
    const customer = await findCustomerByUserId(user.ROWGUID);

    if (!customer) {
      throw new BadRequestError(ERROR_MESSAGE.CUSTOMER_NOT_EXIST);
    }

    const customerCode = customer.CUSTOMER_CODE;
    const orders = await findOrdersByCustomerCode(customerCode);
    let exportedOrders: DeliverOrderEntity[] = [];

    if (orders.length) {
      for (const order of orders) {
        if (CustomerOrderService.getOrderType(order) === OrderType.export) {
          exportedOrders.push(order);
        }
      }
    }
    return exportedOrders;
  };

  static getExportedOrdersByStatus = async (
    status: string,
    user: User,
  ): Promise<ExportedOrder[]> => {
    const orders = await CustomerOrderService.getExportedOrders(user);
    let releasedOrders = [];
    let confirmedOrders = [];
    let exportedOrders: ExportedOrder[] = [];

    if (orders.length) {
      for (let order of orders) {
        const orderDetails: DeliverOrderDetail[] = await findOrderDetailsByOrderNo(
          order.DE_ORDER_NO,
        );
        if (!orderDetails.length) {
          throw new BadRequestError(ERROR_MESSAGE.ORDER_DETAIL_NOT_EXIST);
        }

        let pallets: PalletModel[] = [];
        let jobs: JobQuantityCheck[] = [];
        for (let orderDetail of orderDetails) {
          const _jobs: JobQuantityCheck[] = await getAllJobQuantityCheckByPACKAGE_ID(
            orderDetail.REF_PAKAGE,
          );
          jobs = jobs.concat(_jobs);
          const _pallets: PalletStockEntity[] = (
            await Promise.all(_jobs.map(job => findPalletsByJob(job.ROWGUID)))
          ).flat();
          pallets = pallets.concat(_pallets);
        }

        if (pallets.every(pallet => pallet.PALLET_STATUS === 'R')) {
          releasedOrders.push(order);
        } else {
          confirmedOrders.push(order);
        }
      }

      switch (status) {
        case ExportedOrderStatus.isConfirmed:
          confirmedOrders = confirmedOrders.map(order => {
            const status = ExportedOrderStatus.isConfirmed;
            return Object.assign(order, { status });
          });

          exportedOrders = confirmedOrders;
          break;
        case ExportedOrderStatus.isReleased:
          releasedOrders = releasedOrders.map(order => {
            const status = ExportedOrderStatus.isReleased;
            return Object.assign(order, { status });
          });

          exportedOrders = releasedOrders;
          break;
        default:
          return [];
      }
    }

    return exportedOrders;
  };
}

export default CustomerOrderService;
