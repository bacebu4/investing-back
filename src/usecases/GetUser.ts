import { inject, injectable } from 'inversify';
import { UserImpl } from '../domain/User';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { TYPES } from '../infrastructure/container/types';
import { Usecase } from './interface';
import { Auth } from '../infrastructure/auth/Auth';

export interface GetUser extends Usecase {
  invoke(id: string): UserImpl;
}

@injectable()
export class GetUserImpl implements GetUser {
  public constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.Auth) private auth: Auth
  ) {}

  public invoke(token: string) {
    const userId = this.auth.verifyAndGetUserId(token);
    return this.userRepository.get(userId);
  }
}
