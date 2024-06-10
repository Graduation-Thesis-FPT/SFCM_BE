import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import cellController from '../../controllers/cell.controller';
import { grantPermission } from '../../middlewares';
import { validateCellRequest } from '../../helpers/cellValidator';

const router = Router();

router.use(authentication);

router.post(
  '',
  asyncHandler(grantPermission),
  validateCellRequest,
  asyncHandler(cellController.createAndUpdateCell),
);
router.delete('', asyncHandler(grantPermission), asyncHandler(cellController.deleteCell));
router.get('', asyncHandler(grantPermission), asyncHandler(cellController.getAllCell));

export default router;
