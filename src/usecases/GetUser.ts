import { inject, injectable } from 'inversify';
import { Currency, User } from '../domain/User';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { TYPES } from '../infrastructure/container/types';
import { Usecase } from './interface';
import { TokenService } from '../infrastructure/token/TokenService';

export interface GetUser extends Usecase {
  invoke(id: string): any;
}

@injectable()
export class GetUserImpl implements GetUser {
  public constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.TokenService) private auth: TokenService
  ) {}

  public invoke(token: string) {
    // const userId = this.auth.verifyAndGetUserId(token);
    // return this.userRepository.get(userId);
    return new User({
      id: '1',
      email: '1',
      currency: Currency.Rub,
      hashedPassword: '123',
    });
  }
}
