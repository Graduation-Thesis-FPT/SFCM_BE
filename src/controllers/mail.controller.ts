import { Request, Response } from 'express';
import { CREATED, OK, SuccessResponse } from '../core/success.response';
import { SUCCESS_MESSAGE } from '../constants';
import JobQuantityCheckService from '../services/job-quantity-check.service';
import EmailService from '../services/email.service';

class mailController {
  testSendMail = async (req: Request, res: Response) => {
    new OK({
      message: SUCCESS_MESSAGE.GET_DATA_SUCCESS,
      metadata: await EmailService.sendEmailInvoice(req.body),
    }).send(res);
  };
}

export default new mailController();
