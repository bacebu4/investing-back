import { inject, injectable } from 'inversify';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { TYPES } from '../infrastructure/container/types';
import { Usecase } from './interface';

export interface LoginUser extends Usecase {
  invoke(email: string, password: string): string;
}

@injectable()
export class LoginUserImpl implements LoginUser {
  public constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  public invoke(email: string, password: string) {
    return `123+${email}+${password}`;
  }
}
