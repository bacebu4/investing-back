import { Connection, createConnection } from 'typeorm';
import { TickerEntity } from './entities/TickerEntity';
import { UserEntity } from './entities/UserEntity';
import { User } from '../../domain/User';
import { SymbolEntity } from './entities/SymbolEntity';
import { DatabaseError, DatabaseErrorCode } from './DatabaseError';
import { Either, left, right } from '../../lib/Either';
import { Logger } from '../logger/Logger';
import { Ticker } from '../../domain/interfaces';

export interface Database {
  initialize(): void;
  saveUser(user: User): void;
  saveTicker(
    ticker: Ticker,
    userId: string
  ): Promise<Either<DatabaseError, boolean>>;
  getByEmail(email: string): Promise<Either<DatabaseError, UserEntity>>;
  getUserById(id: string): Promise<Either<DatabaseError, UserEntity>>;
  getTickerIdByUserIdAndSymbol(
    input: Record<'userId' | 'symbol', string>
  ): Promise<Either<DatabaseError, string>>;
  query: (
    query: string,
    parameters?: unknown[]
  ) => Promise<Either<DatabaseError, any>>;
}

// TODO private constructor + factory method
export class DatabaseImpl implements Database {
  private connection: Connection;

  constructor(private logger: Logger) {}

  public async query(query: string, parameters?: unknown[]) {
    try {
      const res = await this.establishedConnection.manager.query(
        query,
        parameters
      );
      return right(res);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error);
      }
      return left(new DatabaseError(DatabaseErrorCode.UNEXPECTED_DB_ERROR));
    }
  }

  get establishedConnection() {
    if (this.connection) {
      return this.connection;
    } else {
      throw new DatabaseError(DatabaseErrorCode.NOT_ESTABLISHED_DB_CONNECTION);
    }
  }

  public async initialize() {
    this.connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'bacebu4',
      password: '',
      database: 'investing-back',
      entities: [UserEntity, TickerEntity, SymbolEntity],
      synchronize: true,
      logging: false,
    });

    this.logger.info('Connection established');
  }

  public async saveUser(user: User) {
    const userRepo = this.establishedConnection.getRepository(UserEntity);
    const userToSave = new UserEntity();
    userToSave.email = user.email;
    userToSave.hashedPassword = user.hashedPassword;
    userToSave.id = user.id;
    userToSave.currency = user.currency;
    await userRepo.save(userToSave);
  }

  public async getTickerIdByUserIdAndSymbol({
    userId,
    symbol,
  }: Record<'userId' | 'symbol', string>) {
    try {
      const [tickerWithId] = await this.establishedConnection.manager.query(
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

      return left(new DatabaseError(DatabaseErrorCode.NOT_FOUND));
    } catch (error) {
      return left(new DatabaseError(DatabaseErrorCode.UNEXPECTED_DB_ERROR));
    }
  }

  public async saveTicker(ticker: Ticker, userId: string) {
    try {
      await this.establishedConnection.manager.query(
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

      return right(true);
    } catch (error) {
      console.log(error);

      return left(new DatabaseError(DatabaseErrorCode.UNEXPECTED_DB_ERROR));
    }
  }

  public async getByEmail(email: string) {
    try {
      const userRepo = this.establishedConnection.getRepository(UserEntity);
      const user = await userRepo.findOne({ email });

      if (!user) {
        return left(new DatabaseError(DatabaseErrorCode.NOT_FOUND));
      }

      return right(user);
    } catch (error) {
      return left(new DatabaseError(DatabaseErrorCode.UNEXPECTED_DB_ERROR));
    }
  }

  public async getUserById(id: string) {
    try {
      const userRepo = this.establishedConnection.getRepository(UserEntity);
      const user = await userRepo.findOne({ id });

      if (!user) {
        return left(new DatabaseError(DatabaseErrorCode.NOT_FOUND));
      }

      return right(user);
    } catch (error) {
      return left(new DatabaseError(DatabaseErrorCode.UNEXPECTED_DB_ERROR));
    }
  }
}
