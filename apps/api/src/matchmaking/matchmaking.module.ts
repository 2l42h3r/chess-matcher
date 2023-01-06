import { Module } from '@nestjs/common';
import { MatchmakingGateway } from './matchmaking.gateway';
import { AbstractMatchingService } from './providers/matching/abstract-matching.service';
import { MatchingService } from './providers/matching/impl/matching.service';
import { AbstractMatchmakingService } from './providers/matchmaking/abstract-matchmaking.service';
import { MatchmakingService } from './providers/matchmaking/impl/matchmaking.service';
import { AbstractSidepickingService } from './providers/sidepicking/abstract-sidepicking.service';
import { SidepickingService } from './providers/sidepicking/impl/sidepicking.service';

@Module({
  providers: [
    MatchmakingGateway,
    { provide: AbstractSidepickingService, useClass: SidepickingService },
    { provide: AbstractMatchingService, useClass: MatchingService },
    { provide: AbstractMatchmakingService, useClass: MatchmakingService },
  ],
})
export class MatchmakingModule {}
