import { Router } from 'express';
import { asyncHandler } from '../../utils';
import deliveryOrderController from '../../controllers/delivery-order.controller';
import { grantPermission } from '../../middlewares';
import { authentication } from '../../auth/authUtils';
import customerOrderController from '../../controllers/customer-order.controller';

const router = Router();

router.use(authentication);
router.get('/getcont', asyncHandler(deliveryOrderController.getContList));
router.get('/getPackageData', asyncHandler(deliveryOrderController.getManifestPackage));
router.post('/getToBillIn', asyncHandler(deliveryOrderController.getToBillIn));
router.post(
  '/saveInOrder',
  asyncHandler(grantPermission),
  asyncHandler(deliveryOrderController.saveInOrder),
);
router.post(
  '/publishInvoice',
  asyncHandler(grantPermission),
  asyncHandler(deliveryOrderController.publishInvoice),
);
router.get('/viewInvoice', asyncHandler(deliveryOrderController.viewInvoice));

router.get('/getContainerList', asyncHandler(deliveryOrderController.getOrderContList));
router.get('/getExManifest', asyncHandler(deliveryOrderController.getExManifest));
router.post(
  '/getToBillEx',
  asyncHandler(grantPermission),
  asyncHandler(deliveryOrderController.getToBillEx),
);
router.post(
  '/publishInvoiceEx',
  asyncHandler(grantPermission),
  asyncHandler(deliveryOrderController.invoicePublishEx),
);
router.post(
  '/saveExOrder',
  asyncHandler(grantPermission),
  asyncHandler(deliveryOrderController.saveExOrder),
);

router.post(
  '/cancel',
  asyncHandler(grantPermission),
  asyncHandler(deliveryOrderController.cancelInvoice),
);
router.get('/getCancelInvoice', asyncHandler(deliveryOrderController.getCancelInvoice));

//report xuất nhập kho
router.get('/getReportInExOrder', asyncHandler(deliveryOrderController.getReportInExOrder));
router.get(
  '/order/:orderNo',
  asyncHandler(grantPermission),
  asyncHandler(customerOrderController.getOrderByOrderNo),
);
export default router;
