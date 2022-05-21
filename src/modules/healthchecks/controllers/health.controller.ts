import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
@ApiTags('Health Checkers')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get('/db')
  checkDBHealthCheck() {
    return this.health.check([() => this.db.pingCheck(process.env.DB_DBNAME!)]);
  }

  @Get('/ping')
  @HttpCode(200)
  checkInstanceHealthCheck() {
    return {
      pong: 'pong',
    };
  }

  @Get('/redis')
  @HttpCode(200)
  checkRedisHealthCheck() {
    return process.env.redis === 'true';
  }
}
