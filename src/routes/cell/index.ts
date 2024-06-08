import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import blockController from '../../controllers/cell.controller';
import { grantPermission } from '../../middlewares';
import { validateCellRequest } from '../../helpers/cellValidator';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validateCellRequest,
  asyncHandler(blockController.createAndUpdateCell),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(blockController.deleteCell));
router.get('', asyncHandler(grantPermission), asyncHandler(blockController.getAllCell));

export default router;
