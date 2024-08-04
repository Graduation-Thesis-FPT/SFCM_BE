import { Router } from 'express';
import { asyncHandler } from '../../utils';
import { authentication } from '../../auth/authUtils';
import menuController from '../../controllers/menu.controller';
import mailController from '../../controllers/mail.controller';

const router = Router();

router.post('', asyncHandler(mailController.testSendMail));

export default router;
