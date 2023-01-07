import { WsException } from '@nestjs/websockets';

export class ServerUnavailableException extends WsException {
  constructor(message?: string) {
    super(message ?? 'ServerUnavailableException');
    this.name = 'ServerUnavailableException';
  }
}
