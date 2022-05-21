/* eslint-disable import/no-namespace */
import type { Provider } from '@nestjs/common';
import * as Redis from 'redis';

export const redisModule = 'redis';

export const redisProvider: Provider = {
  provide: redisModule,
  useValue: Redis,
};
