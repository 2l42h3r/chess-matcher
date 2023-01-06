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

@WebSocketGateway()
export class MoveRelayGateway implements OnGatewayInit {
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer() public server?: Server;

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  @SubscribeMessage('makeMove')
  makeMove(@MessageBody() message: IMoveMessage) {
    if (!this.server) {
      throw new Error();
    }

    this.server.to(message.opponentId).emit('makeMove', message.move);
  }
}
