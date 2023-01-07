import {
  ConnectedSocket,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { AbstractMatchmakingService } from './providers/matchmaking/abstract-matchmaking.service';

@WebSocketGateway({ cors: true })
export class MatchmakingGateway implements OnGatewayInit {
  constructor(
    private readonly matchmakingService: AbstractMatchmakingService,
    private readonly socketService: SocketService,
  ) {}

  @WebSocketServer() public server?: Server;

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  @SubscribeMessage('awaitMatch')
  async awaitMatch(@ConnectedSocket() client: Socket) {
    await this.matchmakingService.matchPlayers(client);
  }
}
