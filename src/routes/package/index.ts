import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import packageController from '../../controllers/package.controller';
import { validatePackageRequest } from '../../middlewares/helpers/packageValidator';
import { grantPermission } from '../../middlewares';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validatePackageRequest,
  asyncHandler(packageController.createAndUpdatepackage),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(packageController.deletepackage));
router.get('', asyncHandler(packageController.getpackage));

export default router;
