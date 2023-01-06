import { Module } from '@nestjs/common';
import { MoveRelayGateway } from './move-relay.gateway';

@Module({
  providers: [MoveRelayGateway],
})
export class MoveRelayModule {}
