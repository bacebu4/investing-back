import { User } from '../../domain/User';
import { Either, left, right } from '../../lib/Either';
import { Database } from '../db';
import { DatabaseErrorCode } from '../db/DatabaseError';
import { Logger } from '../logger/Logger';
import {
  UserRepositoryError,
  UserRepositoryErrorCode,
} from './UserRepositoryError';

export interface UserRepository {
  save(user: User): void;
  getByEmail(email: string): Promise<Either<UserRepositoryError, User>>;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(private logger: Logger, private db: Database) {}

  async getByEmail(email: string) {
    const [error, user] = await this.db.getByEmail(email);

    if (error) {
      if (error?.message === DatabaseErrorCode.NOT_FOUND) {
        return left(new UserRepositoryError(UserRepositoryErrorCode.NOT_FOUND));
      }

      throw new Error();
    }

    const userToReturn = new User({
      id: user.id,
      email: user.email,
      currency: user.currency,
      hashedPassword: user.hashedPassword,
    });

    return right(userToReturn);
  }

  public async save(user: User) {
    await this.db.saveUser(user);
  }
}
