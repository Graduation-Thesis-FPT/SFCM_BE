import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import { grantPermission } from '../../middlewares';
import { validatePackageUnitRequest } from '../../middlewares/helpers/packageUnitValidator';
import packageUnitController from '../../controllers/package-unit.controller';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validatePackageUnitRequest,
  asyncHandler(packageUnitController.createPackageUnit),
);
router.delete('', asyncHandler(packageUnitController.deletePackageUnit));
router.get('', asyncHandler(packageUnitController.getPackageUnit));

export default router;
