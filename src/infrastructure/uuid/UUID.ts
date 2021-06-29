import { v4 } from 'uuid';

export interface UUID {
  generate(): string;
}

export class UUIDImpl {
  generate() {
    return v4();
  }
}
