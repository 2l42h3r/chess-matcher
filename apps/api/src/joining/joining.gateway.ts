import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';
import { AbstractJoiningService } from './providers/joining/abstract-joining.service';

@WebSocketGateway({ cors: true })
export class JoiningGateway implements OnGatewayInit {
  constructor(
    private readonly joiningService: AbstractJoiningService,
    private readonly socketService: SocketService,
  ) {}

  @WebSocketServer() public server?: Server;

  private readonly logger = new Logger(JoiningGateway.name);

  afterInit(server: Server) {
    this.logger.debug('WS server assigned in JoiningGateway');
    this.socketService.socket = server;
  }

  @SubscribeMessage('join')
  async join(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Client with ID ${client.id} attempting joining`);

    if (!this.server) {
      throw new Error();
    }

    await this.joiningService.joinClient(client.id);

    this.server.to(client.id).emit('join', client.id);
  }
}
