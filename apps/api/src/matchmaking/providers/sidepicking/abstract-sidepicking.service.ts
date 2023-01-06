export type TSide = 'white' | 'black';

export abstract class AbstractSidepickingService {
  public abstract pickSides(): [TSide, TSide];
}
