import { Socket } from 'socket.io';

export abstract class AbstractMatchmakingService {
  public abstract matchPlayers(clientSocket: Socket): Promise<void>;
}
