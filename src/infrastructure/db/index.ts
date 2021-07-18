import { Connection, createConnection } from 'typeorm';
import { TickerEntity } from './entities/TickerEntity';
import { UserEntity } from './entities/UserEntity';
import { SymbolEntity } from './entities/SymbolEntity';
import { DatabaseError, DatabaseErrorCode } from './DatabaseError';
import { Either, left, right } from '../../lib/Either';
import { Logger } from '../logger/Logger';

export interface Database {
  query: (
    query: string,
    parameters?: unknown[]
  ) => Promise<Either<DatabaseError, any>>;
}

export class DatabaseImpl implements Database {
  private constructor(private logger: Logger, private connection: Connection) {}

  static async create(logger: Logger) {
    const connection = await createConnection({
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

    logger.info('Connection established');

    return new DatabaseImpl(logger, connection);
  }

  public async query(query: string, parameters?: unknown[]) {
    try {
      const res = await this.connection.manager.query(query, parameters);
      return right(res);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error);
      }
      return left(new DatabaseError(DatabaseErrorCode.UNEXPECTED_DB_ERROR));
    }
  }
}
