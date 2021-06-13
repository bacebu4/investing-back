import { injectable } from 'inversify';
import { Currency, UserImpl } from '../../domain/User';

export interface UserRepository {
  get(id: string): UserImpl;
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
  get(id: string) {
    return new UserImpl({ id, email: 'test@test.com', currency: Currency.Rub });
  }
}
