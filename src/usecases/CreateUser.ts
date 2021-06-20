import { inject, injectable } from 'inversify';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { TYPES } from '../infrastructure/container/types';
import { Usecase } from './interface';
import { UUID } from '../infrastructure/uuid/UUID';
import { Currency, User } from '../domain/User';
import { Crypto } from '../infrastructure/crypto/Crypto';
import { Auth } from '../infrastructure/auth/Auth';

type Payload = { email: string; password: string; currency: Currency };
export interface CreateUser extends Usecase {
  invoke(payload: Payload): Promise<string>;
}

@injectable()
export class CreateUserImpl implements CreateUser {
  public constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.UUID) private uuid: UUID,
    @inject(TYPES.Crypto) private crypto: Crypto,
    @inject(TYPES.Auth) private auth: Auth
  ) {}

  public async invoke({ email, password, currency }: Payload) {
    const userId = this.uuid.generate();
    const hashedPassword = await this.crypto.generateHash(password);

    const user = new User({ id: userId, email, currency, hashedPassword });
    this.userRepository.save(user);

    const token = this.auth.signWithUserId(userId);
    return token;
  }
}
