import { inject, injectable } from 'inversify';
import { Portfolio } from '../../domain/Portfolio';
import { Ticker } from '../../domain/Ticker';
import { Currency, User } from '../../domain/User';
import { TYPES } from '../container/types';
import { Database } from '../db';
import { UserEntity } from '../db/entities/UserEntity';
import { Logger } from '../logger/Logger';

export interface UserRepository {
  get(id: string): User;
  save(user: User): void;
  getByEmail(email: string): Promise<UserEntity>;
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.Database) private db: Database
  ) {
    this.test();
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
    });

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.db.getByEmail(email);

    return user;
  }

  public async save(user: User) {
    await this.db.saveUser(user);
  }
}
