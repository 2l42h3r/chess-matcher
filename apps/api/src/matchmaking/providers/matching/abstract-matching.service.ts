export abstract class AbstractMatchingService {
  public abstract getOpponentID(playerId: string): Promise<string>;
}
