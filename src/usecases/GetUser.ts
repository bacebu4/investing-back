import { inject, injectable } from 'inversify';
import { UserImpl } from '../domain/User';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { TYPES } from '../infrastructure/container/types';

export interface GetUser {
  get(id: string): UserImpl;
}

@injectable()
export class GetUserImpl implements GetUser {
  userRepository;

  public constructor(
    @inject(TYPES.UserRepository) userRepository: UserRepository
  ) {
    this.userRepository = userRepository;
  }

  public get(id: string) {
    return this.userRepository.get(id);
  }
}
