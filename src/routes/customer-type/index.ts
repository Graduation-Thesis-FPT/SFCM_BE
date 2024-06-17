import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import { grantPermission } from '../../middlewares';
import customerTypeController from '../../controllers/customer-type.controller';
import { validateCustomerTypeRequest } from '../../middlewares/helpers/customer-typeValidator';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validateCustomerTypeRequest,
  asyncHandler(customerTypeController.createAndUpdateCustomerType),
);
router.delete(
  '',
  asyncHandler(grantPermission),
  asyncHandler(customerTypeController.deleteCustomerType),
);
router.get('', asyncHandler(grantPermission), asyncHandler(customerTypeController.getCustomerType));

export default router;
