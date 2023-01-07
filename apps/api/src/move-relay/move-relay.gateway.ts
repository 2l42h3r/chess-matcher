import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { IMoveMessage } from './move-message.dto';

@WebSocketGateway({ cors: true })
export class MoveRelayGateway implements OnGatewayInit {
  constructor(
    private readonly socketService: SocketService,
    private readonly logger: Logger,
  ) {}

  @WebSocketServer() public server?: Server;

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  @SubscribeMessage('makeMove')
  makeMove(@MessageBody() message: IMoveMessage) {
    if (!this.server) {
      throw new Error();
    }

    this.logger.debug(
      `Relaying move ${message.move} to opponent ${message.opponentId}`,
    );

    this.server.to(message.opponentId).emit('makeMove', message.move);
  }
}
