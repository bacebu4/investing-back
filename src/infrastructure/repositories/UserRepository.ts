import { inject, injectable } from 'inversify';
import { Currency, User } from '../../domain/User';
import { TYPES } from '../container/types';
import { Database } from '../db';
import { DatabaseErrorCode } from '../db/DatabaseError';
import { Logger } from '../logger/Logger';
import {
  UserRepositoryError,
  UserRepositoryErrorCode,
} from './UserRepositoryError';

export interface UserRepository {
  get(id: string): User;
  save(user: User): void;
  getByEmail(email: string): Promise<[UserRepositoryError | null, User | null]>;
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Database) private db: Database
  ) {
    // this.test();
  }

  private async test() {
    setTimeout(async () => {
      const u = await this.getByEmail('v3@mail.ru');
      console.log(u);
    }, 1500);
  }

  get(id: string) {
    this.logger.info('continue');
    const user = new User({
      id,
      email: 'test@test.com',
      currency: Currency.Rub,
      hashedPassword: '123',
    });

    return user;
  }

  async getByEmail(
    email: string
  ): Promise<[UserRepositoryError | null, User | null]> {
    const [error, user] = await this.db.getByEmail(email);

    if (error?.message === DatabaseErrorCode.NOT_FOUND) {
      return [new UserRepositoryError(UserRepositoryErrorCode.NOT_FOUND), null];
    }

    if (user) {
      const userToReturn = new User({
        id: user.id,
        email: user.email,
        currency: user.currency,
        hashedPassword: user.hashedPassword,
      });

      return [null, userToReturn];
    }

    throw new Error();
  }

  public async save(user: User) {
    await this.db.saveUser(user);
  }
}
