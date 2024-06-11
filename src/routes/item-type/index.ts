import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import itemtypeController from '../../controllers/item-type.controller';
import { grantPermission } from '../../middlewares';
import { validateItemTypeRequest } from '../../helpers/item-typeValidation';

const router = Router();

router.use(authentication);

router.post(
  '',
  // asyncHandler(grantPermission),
  validateItemTypeRequest,
  asyncHandler(itemtypeController.createItemType),
);
router.delete('', asyncHandler(itemtypeController.deleteItemType));
router.get('', asyncHandler(itemtypeController.getItemType));

export default router;
