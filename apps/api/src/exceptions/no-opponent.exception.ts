import { WsException } from '@nestjs/websockets';

export class NoOpponentException extends WsException {
  constructor(message?: string) {
    super(message ?? 'NoOpponentException');
    this.name = 'NoOpponentException';
  }
}
