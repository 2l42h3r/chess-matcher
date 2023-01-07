import { RedisService } from 'src/redis';
import { Injectable, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger(MatchmakingService.name);

  private readonly redisClient: Redis;

  public async matchPlayers(clientSocket: Socket) {
    const wsServer = this.socketService.socket;

    if (!wsServer) {
      throw new Error();
    }

    const playerId = clientSocket.id;

    const queueLength = await this.redisClient.scard('awaiting');

    this.logger.debug(`Checking queue length for client ${playerId}`);

    if (queueLength < 2) {
      this.logger.debug('No other player waiting for match, bailing');
      return;
    }

    const opponentId = await this.matchingService.getOpponentID(playerId);

    this.logger.debug(`Found opponent with id ${opponentId}`);

    const [playerSide, opponentSide] = this.sidepickingService.pickSides();

    this.logger.debug(
      `Requesting client plays ${playerSide}, opponent plays ${opponentSide}`,
    );

    clientSocket.emit('awaitMatch', { opponentId, side: playerSide });

    wsServer
      .to(opponentId)
      .emit('awaitMatch', { opponentId: playerId, side: opponentSide });

    this.logger.debug(`Removing IDs ${playerId}, ${opponentId} from queue`);

    await this.redisClient.srem('awaiting', playerId, opponentId);
  }
}
