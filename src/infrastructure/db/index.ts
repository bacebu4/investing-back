import { injectable } from 'inversify';
import { Connection, createConnection } from 'typeorm';
import { BaseError, ErrorCode } from '../../domain/Error';
import { TickerEntity } from './entities/TickerEntity';
import { UserEntity } from './entities/UserEntity';
import { User } from '../../domain/User';
import { SymbolEntity } from './entities/SymbolEntity';

export interface Database {
  initialize(): void;
  saveUser(user: User): void;
  getByEmail(email: string): Promise<UserEntity>;
}

@injectable()
export class DatabaseImpl implements Database {
  private connection: Connection;

  get establishedConnection() {
    if (this.connection) {
      return this.connection;
    } else {
      throw new BaseError(ErrorCode.NOT_ESTABLISHED_DB_CONNECTION);
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
      logging: true,
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

  public async getByEmail(email: string) {
    const userRepo = this.establishedConnection.getRepository(UserEntity);
    return userRepo.findOne({ email });
  }
}
