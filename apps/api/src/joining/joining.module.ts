import { Module } from '@nestjs/common';
import { JoiningGateway } from './joining.gateway';
import { AbstractJoiningService } from './providers/joining/abstract-joining.service';
import { JoiningService } from './providers/joining/impl/joining.service';

@Module({
  providers: [
    JoiningGateway,
    { provide: AbstractJoiningService, useClass: JoiningService },
  ],
})
export class JoiningModule {}
