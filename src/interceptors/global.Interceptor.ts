import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import type { HeaderDto } from '../common/dto/header.dto';
import { ContextProvider } from '../providers/context.provider';
import { GeneratorProvider } from '../providers/generator.provider';
import { LoggerService } from '../shared/services/logger.service';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  private logger: LoggerService;

  constructor() {
    this.logger = new LoggerService('Request/Response Logger');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const request = context.switchToHttp().getRequest<Request>();

    const headers: HeaderDto = {
      correlationId:
        request.headers['x-correlation-id'] ?? GeneratorProvider.uuid(),
    };

    ContextProvider.setCorrelationId(headers.correlationId);
    ContextProvider.setLanguage(request.headers['accept-language'] as string);

    const requestObject = {
      headers,
      method: request.method,
      url: request.url,
      body: request.body,
    };
    this.logger.info(`Request ${JSON.stringify(requestObject)}`, 'intercept');

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - start;
        this.logger.info(
          `Response ${JSON.stringify(data)} - Duration ${duration} ms`,
          'intercept',
        );
      }),
    );
  }
}
