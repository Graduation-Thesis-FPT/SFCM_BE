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
// router.get('', asyncHandler(customerOrderController.getOrdersByCustomerId));

export default router;
