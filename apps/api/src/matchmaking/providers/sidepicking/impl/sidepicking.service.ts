import { Injectable } from '@nestjs/common';
import {
  AbstractSidepickingService,
  TSide,
} from '../abstract-sidepicking.service';

@Injectable()
export class SidepickingService implements AbstractSidepickingService {
  public pickSides(): [TSide, TSide] {
    if (Math.random() > 0.5) {
      return ['white', 'black'];
    }

    return ['black', 'white'];
  }
}
