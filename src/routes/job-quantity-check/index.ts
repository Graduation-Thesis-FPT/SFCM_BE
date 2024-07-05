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

router.get(
  '/import-tally/:CONTAINER_ID',
  asyncHandler(grantPermission),
  asyncHandler(jobQuantityCheckController.getImportTallyContainerInfo),
);

router.post(
  '/:PACKAGE_ID',
  asyncHandler(grantPermission),
  asyncHandler(jobQuantityCheckController.insertAndUpdateJobQuantityCheck),
);

router.get(
  '/:PACKAGE_ID',
  asyncHandler(grantPermission),
  asyncHandler(jobQuantityCheckController.getAllJobQuantityCheckByPACKAGE_ID),
);

export default router;
