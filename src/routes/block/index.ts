import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import blockController from '../../controllers/block.controller';
import { grantPermission } from '../../middlewares';

const router = Router();

router.use(authentication);

router.post('', asyncHandler(grantPermission), asyncHandler(blockController.createBlock));

export default router;
