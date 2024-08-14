import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import { grantPermission } from '../../middlewares';
import jobQuantityCheckController from '../../controllers/job-quantity-check.controller';

const router = Router();

router.use(authentication);

router.get(
  '/import-tally',
  asyncHandler(grantPermission),
  asyncHandler(jobQuantityCheckController.getAllImportTallyContainer),
);

router.post(
  '/import-tally/complete/:PACKAGE_ID',
  asyncHandler(grantPermission),
  asyncHandler(jobQuantityCheckController.completeJobQuantityCheckByPackageId),
);

router.get(
  '/import-tally/cont-info/:CONTAINER_ID',
  asyncHandler(grantPermission),
  asyncHandler(jobQuantityCheckController.getImportTallyContainerInfo),
);

router.get(
  '/import-tally/:PACKAGE_ID',
  asyncHandler(grantPermission),
  asyncHandler(jobQuantityCheckController.getAllJobQuantityCheckByPackageId),
);

router.post(
  '/import-tally/:PACKAGE_ID',
  asyncHandler(grantPermission),
  asyncHandler(jobQuantityCheckController.insertAndUpdateJobQuantityCheck),
);

export default router;
