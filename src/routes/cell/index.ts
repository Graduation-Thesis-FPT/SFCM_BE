import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import cellController from '../../controllers/cell.controller';
import { grantPermission } from '../../middlewares';

const router = Router();

router.use(authentication);

router.get('', asyncHandler(cellController.suggestCell));
router.get('/available', asyncHandler(cellController.getAvailableCell));

export default router;
