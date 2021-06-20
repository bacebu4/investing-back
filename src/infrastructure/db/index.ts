import { injectable } from 'inversify';
import { Connection, createConnection } from 'typeorm';
import { TickerEntity } from './entities/TickerEntity';
import { UserEntity } from './entities/UserEntity';

export interface Database {
  initialize(): void;
}

@injectable()
export class DatabaseImpl implements Database {
  private connection: Connection;

  get establishedConnection() {
    if (this.connection) {
      return this.connection;
    } else {
      throw new Error('Not established connection');
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
      entities: [UserEntity, TickerEntity],
      synchronize: true,
      logging: true,
    });
  }
}
