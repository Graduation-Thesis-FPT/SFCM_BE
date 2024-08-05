import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import invVatController from '../../controllers/inv-vat.controller';

const router = Router();
router.use(authentication);

router.get('', asyncHandler(invVatController.getReportRevenue));
export default router;
