import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';

@Controller()
@ApiTags('Prometheus')
export class PrometheusController {
  constructor(
    @InjectMetric('http_request_duration_seconds')
    public histogram: Histogram<string>,
  ) {}
}
