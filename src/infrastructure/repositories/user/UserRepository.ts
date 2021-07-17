import { Ticker } from '../../../domain/interfaces';
import { User } from '../../../domain/User';
import { Either, left, right } from '../../../lib/Either';
import { Database } from '../../db';
import { DatabaseErrorCode } from '../../db/DatabaseError';
import { Logger } from '../../logger/Logger';
import {
  UserRepositoryError,
  UserRepositoryErrorCode,
} from './UserRepositoryError';

export interface UserRepository {
  save(user: User): Promise<void>;
  getByEmail(email: string): Promise<Either<UserRepositoryError, User>>;
  getById(id: string): Promise<Either<UserRepositoryError, User>>;
  getTickerIdBySymbolName(
    input: Record<'userId' | 'symbol', string>
  ): Promise<Either<UserRepositoryError, string>>;
  saveTicker(
    ticker: Ticker,
    userId: string
  ): Promise<Either<UserRepositoryError, boolean>>;
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

  async getById(id: string) {
    const [error, user] = await this.db.getUserById(id);

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

  public async saveTicker(ticker: Ticker, userId: string) {
    const [error] = await this.db.saveTicker(ticker, userId);

    if (error) {
      throw new Error();
    }

    return right(true);
  }

  public async getTickerIdBySymbolName({
    userId,
    symbol,
  }: Record<'userId' | 'symbol', string>) {
    const [err, id] = await this.db.getTickerIdByUserIdAndSymbol({
      userId,
      symbol,
    });

    if (err) {
      if (err?.message === DatabaseErrorCode.NOT_FOUND) {
        return left(new UserRepositoryError(UserRepositoryErrorCode.NOT_FOUND));
      }

      throw new Error();
    }

    return right(id);
  }
}
