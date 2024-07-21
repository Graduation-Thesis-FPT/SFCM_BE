import { Router } from "express";
import { authentication } from "../../auth/authUtils";
import { asyncHandler } from "../../utils";
import { grantPermission } from "../../middlewares";
import customerOrderController from "../../controllers/customer-order.controller";

const router = Router();

router.use(authentication);
router.get('', asyncHandler(grantPermission), asyncHandler(customerOrderController.getOrdersByCustomerId));

export default router;