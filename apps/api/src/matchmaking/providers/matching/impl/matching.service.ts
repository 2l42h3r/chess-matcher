import { RedisService } from 'src/redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { sample } from 'lodash';
import { AbstractMatchingService } from '../abstract-matching.service';

@Injectable()
export class MatchingService implements AbstractMatchingService {
  constructor(redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

  private readonly redisClient: Redis;

  public async getOpponentID(playerId: string) {
    const awaitingPlayers = await this.redisClient.smembers('awaiting');
    const opponentId = sample(awaitingPlayers.filter((id) => id !== playerId));

    if (!opponentId) {
      throw new Error();
    }

    return opponentId;
  }
}
