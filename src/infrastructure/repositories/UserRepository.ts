import { inject, injectable } from 'inversify';
import { Currency, UserImpl } from '../../domain/User';
import { TYPES } from '../container/types';
import { Logger } from '../logger/Logger';

export interface UserRepository {
  get(id: string): UserImpl;
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@inject(TYPES.RequestLogger) private logger: Logger) {}
  get(id: string) {
    this.logger.info('continue');
    const user = new UserImpl({
      id,
      email: 'test@test.com',
      currency: Currency.Rub,
    });

    return user;
  }
}
