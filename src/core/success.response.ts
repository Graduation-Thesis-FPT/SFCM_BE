import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from '../utils/httpStatusCode';

interface SuccessResponseOptions {
  message: string;
  statusCode?: number;
  reasonStatusCode?: string;
  metadata: object | void;
}

class SuccessResponse {
  message: string;
  statusCode: number;
  metadata: object | void;

  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }: SuccessResponseOptions) {
    this.message = !message ? reasonStatusCode : message; 
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res: Response) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }: { message?: string; metadata?: object }) {
    super({ message, metadata, statusCode: StatusCodes.OK, reasonStatusCode: ReasonPhrases.OK });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
  }: SuccessResponseOptions) {
    super({ message, statusCode, reasonStatusCode, metadata });
  }
}

export { SuccessResponse, OK, CREATED };
