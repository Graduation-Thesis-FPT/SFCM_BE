import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import blockController from '../../controllers/block.controller';
import { grantPermission } from '../../middlewares';
import gateController from '../../controllers/gate.controller';
import { validateGateRequest } from '../../helpers/gateValidator';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validateGateRequest,
  asyncHandler(gateController.createAndUpdateGate),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(blockController.deleteBlock));
router.get('', asyncHandler(grantPermission), asyncHandler(blockController.getBlock));

export default router;
