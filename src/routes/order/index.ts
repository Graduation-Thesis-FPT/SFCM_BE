import { Router } from 'express';
import { asyncHandler } from '../../utils';
// import { authentication } from '../../auth/authUtils';
import orderController from '../../controllers/order.controller';

const router = Router();

// router.use(authentication);
router.get('', asyncHandler(orderController.genOrderNo));
router.get('/draft-no', asyncHandler(orderController.genDraftNo));

export default router;
