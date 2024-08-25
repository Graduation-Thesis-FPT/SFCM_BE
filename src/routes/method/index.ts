import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import methodController from '../../controllers/method.controller';
import { validateMethodRequest } from '../../middlewares/helpers/methodValidator';
import { grantPermission } from '../../middlewares';

const router = Router();

router.use(authentication);

router.post(
  '',
  validateMethodRequest,
  asyncHandler(grantPermission),
  asyncHandler(methodController.createAndUpdateMethod),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(methodController.deleteMethod));
router.get('', asyncHandler(methodController.getAllMethod));

export default router;
