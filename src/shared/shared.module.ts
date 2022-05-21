import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import {
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

// eslint-disable-next-line import/no-namespace
import { ConfigurationService } from './services/configuration.service';
import { LoggerService } from './services/logger.service';
import { RedisModule } from './services/redis/redis.module';
import { TranslationService } from './services/translation.service';
import { UtilService } from './services/util.service';

const providers = [
  ConfigurationService,
  TranslationService,
  UtilService,
  LoggerService,
  String,
  makeHistogramProvider({
    name: 'http_request_duration_seconds', // metric name.
    help: 'Duration of HTTP requests in seconds', // metric help (description).
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  }),
];

@Global()
@Module({
  providers,
  imports: [
    HttpModule,
    RedisModule,
    PrometheusModule.register({
      // This will register a /metrics endpoint that will return the default metrics.
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'sary_',
        },
      },
    }),
  ],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
