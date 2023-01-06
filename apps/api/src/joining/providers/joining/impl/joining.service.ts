import { RedisService } from 'src/redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AbstractJoiningService } from '../abstract-joining.service';

@Injectable()
export class JoiningService implements AbstractJoiningService {
  constructor(redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

  private readonly redisClient: Redis;

  public joinClient(id: string) {
    return this.redisClient.sadd('awaiting', id);
  }
}
