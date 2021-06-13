import { inject, injectable } from 'inversify';
import { UserImpl } from '../domain/User';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { TYPES } from '../infrastructure/container/types';

export interface GetUser {
  invoke(id: string): UserImpl;
}

@injectable()
export class GetUserImpl implements GetUser {
  public constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  public invoke(id: string) {
    return this.userRepository.get(id);
  }
}
