import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import { grantPermission } from '../../middlewares';
import gateController from '../../controllers/gate.controller';
import { validateGateRequest } from '../../middlewares/helpers/gateValidator';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validateGateRequest,
  asyncHandler(gateController.createAndUpdateGate),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(gateController.deleteGate));
router.get('', asyncHandler(grantPermission), asyncHandler(gateController.getAllGate));

export default router;
