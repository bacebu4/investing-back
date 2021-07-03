import { Either } from '../lib/Either';

export interface Usecase {
  invoke(...args: any[]): Promise<Either<Error[], any>>;
}
