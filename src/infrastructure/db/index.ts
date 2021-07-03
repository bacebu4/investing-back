import { Connection, createConnection } from 'typeorm';
import { TickerEntity } from './entities/TickerEntity';
import { UserEntity } from './entities/UserEntity';
import { User } from '../../domain/User';
import { SymbolEntity } from './entities/SymbolEntity';
import { DatabaseError, DatabaseErrorCode } from './DatabaseError';
import { Either, left, right } from '../../lib/Either';
import { Logger } from '../logger/Logger';

export interface Database {
  initialize(): void;
  saveUser(user: User): void;
  getByEmail(email: string): Promise<Either<DatabaseError, UserEntity>>;
}

export class DatabaseImpl implements Database {
  private connection: Connection;

  constructor(private logger: Logger) {}

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
}
