import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { Response } from 'express';

import type { ErrorException } from '../exceptions/error.exception';
import { ContextProvider } from '../providers/context.provider';
import { TranslationService } from '../shared/services/translation.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly translationService: TranslationService) {}

  async catch(exception: ErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.error) {
      exception.error.message = await this.translationService.translate(
        `error.${exception.error?.code}`,
        {
          lang: ContextProvider.getLanguage(),
        },
      );
      response.status(exception.getStatus()).json(exception.error);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorResponse = <any>exception.getResponse();
      response.status(exception.getStatus()).json({
        statusCode: errorResponse.statusCode,
        message: errorResponse.message,
      });
    }
  }
}
