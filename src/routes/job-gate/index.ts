import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import jobGateController from '../../controllers/job-gate.controller';
import { validateItemTypeRequest } from '../../middlewares/helpers/item-typeValidation';

const router = Router();

router.use(authentication);

router.post(
  '',
  // asyncHandler(grantPermission),
  validateItemTypeRequest,
  asyncHandler(jobGateController.createJobGate),
);
router.delete('', asyncHandler(jobGateController.deleteBlock));
router.get('', asyncHandler(jobGateController.getBlock));

export default router;
