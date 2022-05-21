import type { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

import type { IError } from '../constants/error-code';
import { LoggerService } from '../shared/services/logger.service';

export abstract class ErrorException extends HttpException {
  statusCode: string;
  error: IError;
  logger: LoggerService = new LoggerService(ErrorException.name);

  constructor(error: IError, httpStatus: HttpStatus) {
    super(error, httpStatus);
    this.statusCode = error?.code;
    this.error = error;
    this.logger.error(
      'General error thrown',
      `${ErrorException.name}.constructor`,
      error,
    );
  }
}
