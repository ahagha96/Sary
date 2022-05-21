import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from '../../shared/services/redis/redis.module';
import { AuthModule } from '../auth/auth.module';
import { TableController } from './table.controller';
import { TableRepository } from './table.repository';
import { TableService } from './table.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TableRepository]),
    AuthModule,
    RedisModule,
  ],
  providers: [TableService],
  exports: [TableService],
  controllers: [TableController],
})
export class TableModule {}
