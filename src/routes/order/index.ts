import { Router } from 'express';
import { asyncHandler } from '../../utils';
// import { authentication } from '../../auth/authUtils';
import orderController from '../../controllers/order.controller';

const router = Router();

// router.use(authentication);
router.get('/getcont', asyncHandler(orderController.getContList));
router.get('/getPackageData', asyncHandler(orderController.getManifestPackage));
router.post('/getToBillIn', asyncHandler(orderController.getToBillIn));
router.post('/saveInOrder', asyncHandler(orderController.saveInOrder));

export default router;
