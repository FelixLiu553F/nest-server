import { Module } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

const services = [RedisService];

@Module({
  providers: [...services],
  exports: [...services],
})
export class MicroservicesModule {}
