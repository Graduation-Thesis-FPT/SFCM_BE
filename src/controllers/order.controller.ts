import { Request, Response } from 'express';
class orderController {
  genOrderNo = async (req: Request, res: Response) => {
    res.json({
      data: null,
    });
  };

  genDraftNo = async (req: Request, res: Response) => {
    res.json({
      data: null,
    });
  };
}

export default new orderController();
