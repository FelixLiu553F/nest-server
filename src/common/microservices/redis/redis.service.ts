import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CONFIG } from 'src/configs/redis.config';
import { nanoid } from 'nanoid';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis(REDIS_CONFIG);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async delKeys(keyStr: string): Promise<void> {
    const keys = await this.client.keys(keyStr);

    if (keys.length) {
      const pipeline = this.client.pipeline();

      for (const key of keys) {
        pipeline.del(key);
      }

      await pipeline.exec();
    }
  }
}

export const CacheKeys = {
  userSession: (token: string) => `USER:${token}`,
  genUserSessionToken: (userId: string) => `${userId}:${nanoid()}`,
};
