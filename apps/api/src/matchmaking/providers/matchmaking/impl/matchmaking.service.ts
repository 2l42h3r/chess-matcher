import { RedisService } from 'src/redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { AbstractMatchingService } from '../../matching/abstract-matching.service';
import { AbstractSidepickingService } from '../../sidepicking/abstract-sidepicking.service';
import { AbstractMatchmakingService } from '../abstract-matchmaking.service';

@Injectable()
export class MatchmakingService implements AbstractMatchmakingService {
  constructor(
    redisService: RedisService,
    private readonly socketService: SocketService,
    private readonly matchingService: AbstractMatchingService,
    private readonly sidepickingService: AbstractSidepickingService,
  ) {
    this.redisClient = redisService.getClient();
  }

  private readonly redisClient: Redis;

  public async matchPlayers(clientSocket: Socket) {
    const wsServer = this.socketService.socket;

    if (!wsServer) {
      throw new Error();
    }

    const playerId = clientSocket.id;

    const queueLength = await this.redisClient.scard('awaiting');

    if (queueLength < 2) {
      return;
    }

    const opponentId = await this.matchingService.getOpponentID(playerId);

    const [playerSide, opponentSide] = this.sidepickingService.pickSides();

    clientSocket.emit('awaitMatch', { opponentId, side: playerSide });

    wsServer
      .to(opponentId)
      .emit('awaitMatch', { opponentId: playerId, side: opponentSide });

    await this.redisClient.srem('awaiting', playerId, opponentId);
  }
}
