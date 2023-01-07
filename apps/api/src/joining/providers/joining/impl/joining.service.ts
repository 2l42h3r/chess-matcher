import { RedisService } from 'src/redis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AbstractJoiningService } from '../abstract-joining.service';

@Injectable()
export class JoiningService implements AbstractJoiningService {
  constructor(redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

  private readonly redisClient: Redis;

  private readonly logger = new Logger(JoiningService.name);

  public joinClient(id: string) {
    this.logger.debug(`Adding client with id ${id} to waiting queue`);
    return this.redisClient.sadd('awaiting', id);
  }
}
