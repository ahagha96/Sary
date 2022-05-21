/* eslint-disable no-console */
import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from '@node-redis/client/dist/lib/client';

import { RedisNotConnectedException } from '../../../exceptions/exception';
import { ConfigurationService } from '../configuration.service';
import { redisModule } from './redis.provider';

@Injectable()
export class RedisService {
  private redisClient: RedisClientType;

  constructor(@Inject(redisModule) private redisInstance) {
    this.redisClient = redisInstance.createClient({
      url: `redis://${new ConfigurationService().get(
        'REDIS_PASSWORD',
      )}@${new ConfigurationService().get(
        'REDIS_HOST',
      )}:${new ConfigurationService().getNumber('REDIS_PORT')}`,
    });

    this.redisClient.on('error', () => {
      process.env.redis = 'false';
    });
    this.redisClient.on('ready', () => {
      process.env.redis = 'true';
    });

    void this.redisClient.connect();
  }

  async save(key: string, value: string): Promise<string | null> {
    if (!this.isConnected()) {
      throw new RedisNotConnectedException();
    }

    return this.redisClient.set(key, value);
  }

  async saveJSON(
    key: string,
    value: unknown,
    keepTTL = false,
    ttl?: number,
  ): Promise<string | unknown> {
    if (!this.isConnected()) {
      throw new RedisNotConnectedException();
    }

    const jsonToString = JSON.stringify(value);

    if (keepTTL) {
      ttl = await this.redisClient.TTL(key);
    }

    return this.redisClient.set(key, jsonToString, {
      EX: ttl,
    });
  }

  async get(key: string): Promise<string | unknown> {
    if (!this.isConnected()) {
      throw new RedisNotConnectedException();
    }

    return this.redisClient.get(key);
  }

  async del(key: string) {
    if (!this.isConnected()) {
      throw new RedisNotConnectedException();
    }

    return this.redisClient.del(key);
  }

  async delKeys(key: string): Promise<number> {
    if (!this.isConnected()) {
      throw new RedisNotConnectedException();
    }

    const allKeys = await this.redisClient.keys(`*${key}*`);

    for (const singleKey of allKeys) {
      await this.del(singleKey);
    }

    return allKeys.length;
  }

  async getTTL(key: string): Promise<number> {
    if (!this.isConnected()) {
      throw new RedisNotConnectedException();
    }

    return this.redisClient.ttl(key);
  }

  private isConnected(): boolean {
    return process.env.redis === 'true';
  }
}
