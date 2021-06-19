import { injectable } from 'inversify';
import { v4 } from 'uuid';

export interface UUID {
  generate(): string;
}

@injectable()
export class UUIDImpl {
  generate() {
    return v4();
  }
}
