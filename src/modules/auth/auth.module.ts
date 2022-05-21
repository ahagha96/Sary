import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigurationService } from '../../shared/services/configuration.service';
import { RedisModule } from '../../shared/services/redis/redis.module';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    SharedModule,
    RedisModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigurationService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
      imports: [SharedModule],
      inject: [ConfigurationService],
    }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
