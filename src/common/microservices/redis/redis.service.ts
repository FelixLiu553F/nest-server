import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CONFIG } from 'src/configs/redis.config';
import { cloneDeep } from 'lodash';
import { nanoid } from 'nanoid';
import { SafeJsonType } from 'safe-json-type';

export const redisClient = new Redis(REDIS_CONFIG);
@Injectable()
export class RedisService {
  async delKeys(keyStr: string): Promise<void> {
    const keys = await redisClient.keys(keyStr);

    if (keys.length) {
      const pipeline = redisClient.pipeline();

      for (const key of keys) {
        pipeline.del(key);
      }

      await pipeline.exec();
    }
  }

  CacheCleaners = {
    byKey: (key: string) => redisClient.del(key),
    userSession: (userId: string) => this.delKeys(`USER:${userId}:*`),
    userFolderRoleMap: async (userIds: string[]) => {
      const promises = userIds.map(async (userId) => {
        await redisClient.del(this.CacheKeys.userFolderRoleMap(userId));
      });
      await Promise.all(promises);
    },
  };

  CacheKeys = {
    userSession: (token: string) => `USER:${token}`,
    genUserSessionToken: (userId: string) => `${userId}:${nanoid()}`,
    userFolderRoleMap: (userId: string) => `FOLDER:ROLE_MAP:${userId}`,
    emailVerifyCode: (email: string) => `EMAIL_VERIFY_CODE:${email}`,
  };
}

export function serialize(value: any) {
  return SafeJsonType.stringify(cloneDeep(value));
}

export function deserialize<T = any>(value: string) {
  return SafeJsonType.parse(value) as T;
}
