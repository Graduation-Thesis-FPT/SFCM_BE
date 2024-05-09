import {  Request, Response } from "express";
import AccessService from "../services/access.service";
import { SuccessResponse } from "../core/success.response";

class AccessController {
    login = async (req: Request, res: Response) => {
        new SuccessResponse({
            message: "login success",
            metadata: await AccessService.login()
        }).send(res)
    }
}

export default new AccessController()