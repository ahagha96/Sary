import './utils/utils';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import path from 'path';

import { ApplicationService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/healthchecks/health.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { TableModule } from './modules/table/table.module';
import { UserModule } from './modules/user/user.module';
import { ConfigurationService } from './shared/services/configuration.service';
import { RedisModule } from './shared/services/redis/redis.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TableModule,
    ReservationModule,
    SharedModule,
    HealthModule,
    RedisModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigurationService) =>
        configService.postgresConfig,
      inject: [ConfigurationService],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigurationService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        parserOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      imports: [SharedModule, UserModule],
      parser: I18nJsonParser,
      inject: [ConfigurationService],
    }),
  ],
  exports: [ApplicationService],
  providers: [ApplicationService],
})
export class AppModule {}
