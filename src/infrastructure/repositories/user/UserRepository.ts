import { Ticker } from '../../../domain/interfaces';
import { User } from '../../../domain/User';
import { Either, left, right } from '../../../lib/Either';
import { Database } from '../../db';
import { Logger } from '../../logger/Logger';
import {
  UserRepositoryError,
  UserRepositoryErrorCode,
} from './UserRepositoryError';

export interface UserRepository {
  save(user: User): Promise<Either<UserRepositoryError, boolean>>;
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
    const [, [user]] = await this.db.query(
      /* sql */
      `
        SELECT
          *
        FROM
          user_entity
        WHERE
          email = $1
      `,
      [email]
    );

    if (!user) {
      return left(new UserRepositoryError(UserRepositoryErrorCode.NOT_FOUND));
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
    const [, [user]] = await this.db.query(
      /* sql */
      `
        SELECT
          *
        FROM
          user_entity
        WHERE
          id = $1
      `,
      [id]
    );

    if (!user) {
      return left(new UserRepositoryError(UserRepositoryErrorCode.NOT_FOUND));
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
    const [, success] = await this.db.query(
      /* sql */
      `
        INSERT INTO user_entity (id, email, "hashedPassword", currency)
          VALUES($1, $2, $3, $4)
      `,
      [user.id, user.email, user.hashedPassword, user.currency]
    );

    if (success) {
      return right(true);
    }

    return left(
      new UserRepositoryError(UserRepositoryErrorCode.UNEXPECTED_ERROR)
    );
  }

  public async saveTicker(ticker: Ticker, userId: string) {
    const [, success] = await this.db.query(
      /* sql */
      `
      INSERT INTO ticker_entity(id, amount, "percentageAimingTo", "userIdId", "symbolSymbol")
        VALUES($1, $2, $3, $4, $5)
      `,
      [
        ticker.id,
        ticker.amount,
        ticker.percentageAimingTo,
        userId,
        ticker.symbol.value,
      ]
    );

    if (success) {
      return right(true);
    }

    return left(
      new UserRepositoryError(UserRepositoryErrorCode.UNEXPECTED_ERROR)
    );
  }

  public async getTickerIdBySymbolName({
    userId,
    symbol,
  }: Record<'userId' | 'symbol', string>) {
    const [, [tickerWithId]] = await this.db.query(
      /* sql */
      `
      SELECT
        id
      FROM
        ticker_entity
      WHERE
        "userIdId" = $1
        AND "symbolSymbol" = $2
      `,
      [userId, symbol]
    );

    const id = tickerWithId?.id;
    if (id) {
      return right(id);
    }

    return left(new UserRepositoryError(UserRepositoryErrorCode.NOT_FOUND));
  }
}
