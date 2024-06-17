import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import containerController from '../../controllers/container.controller';
import { validateContainerRequest } from '../../middlewares/helpers/containerValidator';

const router = Router();

router.use(authentication);

router.post(
  '',
  validateContainerRequest,
  asyncHandler(containerController.createAndUpdateContainer),
);
router.delete('', asyncHandler(containerController.deleteContainer));
router.get('', asyncHandler(containerController.getAllContainer));

export default router;
