import {
  ClassSerializerInterceptor,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression';
import { middleware as expressCtx } from 'express-ctx';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import { AppModule } from './app.module';
import { SchemaValidationError } from './exceptions';
import { HttpExceptionFilter } from './filters/exception-translate.filter';
import { GlobalInterceptor } from './interceptors/global.Interceptor';
import { TranslationInterceptor } from './interceptors/translation-interceptor';
import { setupSwagger } from './setup-swagger';
import { TranslationService } from './shared/services/translation.service';
import { SharedModule } from './shared/shared.module';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.use(compression());
  app.enableVersioning();

  const reflector = app.get(Reflector);
  const translateService = app.select(SharedModule).get(TranslationService);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new GlobalInterceptor(),
    new TranslationInterceptor(translateService),
  );

  app.useGlobalFilters(new HttpExceptionFilter(translateService));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: () => new SchemaValidationError(),
    }),
  );

  setupSwagger(app);

  app.use(expressCtx);
  await app.listen(process.env.PORT || 3000);
}

void bootstrap();
