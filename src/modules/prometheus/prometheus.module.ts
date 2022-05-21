import { Module } from '@nestjs/common';

import { PrometheusController as PrometheusController } from './prometheus.controller';

@Module({
  controllers: [PrometheusController],
})
export class PrometheusModule {}
