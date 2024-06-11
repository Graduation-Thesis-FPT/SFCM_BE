import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import unitController from '../../controllers/unit.controller';
import { grantPermission } from '../../middlewares';
import { validateUnitRequest } from '../../helpers/unitValidator';

const router = Router();

router.use(authentication);

router.post(
  '',
  // asyncHandler(grantPermission),
  validateUnitRequest,
  asyncHandler(unitController.createUnit),
);
router.delete('', asyncHandler(unitController.deleteUnit));
router.get('', asyncHandler(unitController.getUnit));

export default router;
