'use strict';

import { ReasonPhrases } from '../utils/reasonPhrases';
import { StatusCodes } from '../utils/statusCodes';

const StatusCode = {
  FORBIDDEN: 403,
  CONFLIC: 409,
};

const ReasonStatusCode = {
  FORBIDDEN: 'Bad request error',
  CONFLIC: 'Conflic error',
};

export class ErrorResponse extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class ConflicRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLIC,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLIC,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

export class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}
