import { RedisNestModule } from 'src/redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JoiningModule } from './joining/joining.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { MoveRelayModule } from './move-relay/move-relay.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SocketModule,
    RedisNestModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    JoiningModule,
    MoveRelayModule,
    MatchmakingModule,
  ],
})
export class AppModule {}
