'use strict';
import { Response } from 'express';

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: 'Success',
  CREATED: 'Created',
};

type TSuccessResponse = {
  message?: string;
  metadata: any;
  statusCode?: number;
  reasonStatusCode?: string;
};

class SuccessResponse {
  message: string | number;
  statusCode: number;
  metadata: any;
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }: TSuccessResponse) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res: Response, header = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }: TSuccessResponse) {
    super({ message, metadata });
  }
}

type TCreatedResponse = {
  message: string;
  metadata: any;
  statusCode?: number;
  reasonStatusCode?: string;
  options: any;
};

class CREATED extends SuccessResponse {
  options: any;
  constructor({
    options = {},
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
  }: TCreatedResponse) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

export { OK, CREATED, SuccessResponse };
