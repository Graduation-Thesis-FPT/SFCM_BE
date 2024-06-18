import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import packageController from '../../controllers/package.controller';
import { validatePackageRequest } from '../../middlewares/helpers/packageValidator';

const router = Router();

router.use(authentication);

router.post('', validatePackageRequest, asyncHandler(packageController.createAndUpdatepackage));
router.delete('', asyncHandler(packageController.deletepackage));
router.get('', asyncHandler(packageController.getpackage));

export default router;
