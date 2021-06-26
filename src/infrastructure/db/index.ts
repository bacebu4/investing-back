import { injectable } from 'inversify';
import { Connection, createConnection } from 'typeorm';
import { BaseError, ErrorCode } from '../../domain/Error';
import { TickerEntity } from './entities/TickerEntity';
import { UserEntity } from './entities/UserEntity';
import { User } from '../../domain/User';
import { SymbolEntity } from './entities/SymbolEntity';
import { DatabaseError, DatabaseErrorCode } from './DatabaseError';

export interface Database {
  initialize(): void;
  saveUser(user: User): void;
  getByEmail(email: string): Promise<[DatabaseError | null, UserEntity | null]>;
}

@injectable()
export class DatabaseImpl implements Database {
  private connection: Connection;

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

  public async getByEmail(
    email: string
  ): Promise<[DatabaseError | null, UserEntity | null]> {
    const userRepo = this.establishedConnection.getRepository(UserEntity);
    const user = await userRepo.findOne({ email });
    if (!user) {
      return [new DatabaseError(DatabaseErrorCode.NOT_FOUND), null];
    }
    return [null, user];
  }
}
