import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisClient, RedisClientError } from './redis-client.provider';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  getClient(name?: string): Redis {
    if (!name) {
      name = this.redisClient.defaultKey;
    }

    const client = this.redisClient.clients.get(name);

    if (!client) {
      throw new RedisClientError(`client ${name} does not exist`);
    }

    return client;
  }

  getClients() {
    return this.redisClient.clients;
  }
}
