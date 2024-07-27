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
    console.log('getOrders:', new Date().getTime() - start_time);
    // console.log('orders2', orders);
    let storedOrders = [];
    let checkedOrders = [];
    let confirmedOrders = [];
    let importedOrders: ImportedOrder[] = [];

    if (orders.length) {
      // each order has a list of order details
      // get all order details of all orders
      for (let order of orders) {
        const _start_time = new Date().getTime();
        const orderDetails: DeliverOrderDetail[] = await findOrderDetailsByOrderNo(
          order.DE_ORDER_NO,
        );
        console.log('findOrderDetailsByOrderNo:', new Date().getTime() - _start_time);
        if (!orderDetails.length) {
          throw new BadRequestError(ERROR_MESSAGE.ORDER_DETAIL_NOT_EXIST);
        }
        // console.log('orderDetails', order.DE_ORDER_NO, orderDetails.length);
        let pallets: PalletModel[] = [];
        let jobs: JobQuantityCheck[] = [];
        for (let orderDetail of orderDetails) {
          const __start_time = new Date().getTime();
          const _jobs: JobQuantityCheck[] = await getAllJobQuantityCheckByPACKAGE_ID(
            orderDetail.REF_PAKAGE,
          );
          console.log('getAllJobQuantityCheckByPACKAGE_ID:', new Date().getTime() - __start_time);
          jobs = jobs.concat(_jobs);
          // each job has one pallet
          // find all pallets for all jobs by job.ROWGUID
          const __start_time2 = new Date().getTime();
          const _pallets: PalletStockEntity[] = (
            await Promise.all(_jobs.map(job => findPalletsByJob(job.ROWGUID)))
          ).flat();
          console.log('findPalletsByJob:', new Date().getTime() - __start_time2);
          pallets = pallets.concat(_pallets);
        }
        const uniqueJobPackageIds = new Set(jobs.map(job => job.PACKAGE_ID));
        const uniqueOrderDetailPackageIds = new Set(
          orderDetails.map(orderDetail => orderDetail.REF_PAKAGE),
        );
        if (
          uniqueJobPackageIds.size === uniqueOrderDetailPackageIds.size &&
          [...uniqueJobPackageIds].every(id => uniqueOrderDetailPackageIds.has(id))
        ) {
          if (pallets.every(pallet => pallet.PALLET_STATUS === 'S')) {
            storedOrders.push(order);
          } else if (jobs.every(job => job.JOB_STATUS === 'C')) {
            checkedOrders.push(order);
          } else {
            confirmedOrders.push(order);
          }
        } else {
          confirmedOrders.push(order);
        }
      }
      // console.log('storedOrders', storedOrders.length);
      // console.log('checkedOrders', checkedOrders.length);
      // console.log('confirmedOrders', confirmedOrders.length);
      switch (status) {
        case ImportedOrderStatus.isConfirmed:
          confirmedOrders = confirmedOrders.map(order => {
            const status = ImportedOrderStatus.isConfirmed;
            return Object.assign(order, { status });
          });
          // console.log('confirmedOrders', confirmedOrders.length);
          importedOrders = confirmedOrders;
          // console.log('importedOrders', importedOrders.length);
          break;
        case ImportedOrderStatus.isChecked:
          checkedOrders = checkedOrders.map(order => {
            const status = ImportedOrderStatus.isChecked;
            return Object.assign(order, { status });
          });

          importedOrders = checkedOrders;
          break;
        case ImportedOrderStatus.isStored:
          storedOrders = storedOrders.map(order => {
            const status = ImportedOrderStatus.isStored;
            return Object.assign(order, { status });
          });
          importedOrders = storedOrders;
          break;
        default:
          return importedOrders;
      }
    }
    const end_time = new Date().getTime();
    console.log('getImportedOrdersByStatus:', end_time - start_time);
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
