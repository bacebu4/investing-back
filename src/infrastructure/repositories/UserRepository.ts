import { inject, injectable } from 'inversify';
import { Currency, User } from '../../domain/User';
import { TYPES } from '../container/types';
import { Database } from '../db';
import { Logger } from '../logger/Logger';

export interface UserRepository {
  get(id: string): User;
  save(user: User): void;
  getByEmail(email: string): User;
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Database) private db: Database
  ) {}

  get(id: string) {
    this.logger.info('continue');
    const user = new User({
      id,
      email: 'test@test.com',
      currency: Currency.Rub,
    });

    return user;
  }

  getByEmail(email: string) {
    return new User({
      hashedPassword: 'hashed',
      id: '1230123-213-sdf-213',
    });
  }

  public async save(user: User) {
    await this.db.saveUser(user);
  }
}
