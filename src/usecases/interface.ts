import { Either } from '../lib/Either';

export interface Usecase {
  invoke(...args: unknown[]): Promise<Either<Error[], unknown>>;
}
