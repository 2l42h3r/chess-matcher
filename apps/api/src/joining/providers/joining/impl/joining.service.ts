import { RedisService } from 'src/redis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AbstractJoiningService } from '../abstract-joining.service';

@Injectable()
export class JoiningService implements AbstractJoiningService {
  constructor(redisService: RedisService, private readonly logger: Logger) {
    this.redisClient = redisService.getClient();
  }

  private readonly redisClient: Redis;

  public joinClient(id: string) {
    this.logger.debug(`Adding client with id ${id} to waiting queue`);
    return this.redisClient.sadd('awaiting', id);
  }
}
