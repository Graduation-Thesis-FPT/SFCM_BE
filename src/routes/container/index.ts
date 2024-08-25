import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import containerController from '../../controllers/container.controller';
import { validateContainerRequest } from '../../middlewares/helpers/containerValidator';
import { grantPermission } from '../../middlewares';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validateContainerRequest,
  asyncHandler(containerController.createAndUpdateContainer),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(containerController.deleteContainer));
router.get('', asyncHandler(containerController.getAllContainer));

export default router;
