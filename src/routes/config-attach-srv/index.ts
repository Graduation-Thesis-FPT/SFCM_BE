import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import { grantPermission } from '../../middlewares';
import configAttachSrvController from '../../controllers/config-attach-srv.controller';

const router = Router();

router.use(authentication);

router.get('/:METHOD_CODE', asyncHandler(configAttachSrvController.getConfigAttachSrvByMethodCode));

router.post(
  '/:METHOD_CODE',
  asyncHandler(grantPermission),
  asyncHandler(configAttachSrvController.createAndUpdateConfigAttachSrvByMethodCode),
);

export default router;
