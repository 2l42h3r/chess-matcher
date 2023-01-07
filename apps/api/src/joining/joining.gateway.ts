import {
  ConnectedSocket,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
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

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  @SubscribeMessage('join')
  join(@ConnectedSocket() client: Socket): Observable<WsResponse<string>> {
    return from(this.joiningService.joinClient(client.id)).pipe(
      map(() => ({ event: 'join', data: client.id })),
    );
  }
}
