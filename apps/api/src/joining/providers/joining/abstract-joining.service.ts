export abstract class AbstractJoiningService {
  public abstract joinClient(id: string): Promise<number>;
}
