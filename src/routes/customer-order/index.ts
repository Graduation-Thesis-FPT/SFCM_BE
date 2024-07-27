import { Router } from 'express';
import { authentication } from '../../auth/authUtils';
import customerOrderController from '../../controllers/customer-order.controller';
import { asyncHandler } from '../../utils';
import { grantPermission } from '../../middlewares';

const router = Router();

router.use(authentication);
router.get(
  '',
  asyncHandler(grantPermission),
  asyncHandler(customerOrderController.getOrdersByCustomerId),
);
router.get(
  '/import-orders',
  asyncHandler(grantPermission),
  asyncHandler(customerOrderController.getImportedOrders),
);
router.get(
  '/export-orders',
  asyncHandler(grantPermission),
  asyncHandler(customerOrderController.getExportedOrders),
);
export default router;
