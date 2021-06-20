import { inject, injectable } from 'inversify';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { TYPES } from '../infrastructure/container/types';
import { Usecase } from './interface';
import { Crypto } from '../infrastructure/crypto/Crypto';
import { Auth } from '../infrastructure/auth/Auth';
import { ErrorCode, BaseError } from '../domain/Error';

type Payload = {
  email: string;
  password: string;
};
export interface LoginUser extends Usecase {
  invoke({ email, password }: Payload): Promise<string>;
}

@injectable()
export class LoginUserImpl implements LoginUser {
  public constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.Crypto) private crypto: Crypto,
    @inject(TYPES.Auth) private auth: Auth
  ) {}

  public async invoke({ email, password }: Payload) {
    const { hashedPassword, id: userId } =
      this.userRepository.getByEmail(email);

    await this.validatePassword(password, hashedPassword);

    return this.auth.signWithUserId(userId);
  }

  private async validatePassword(password: string, hashedPassword: string) {
    const res = await this.crypto.compareValueWithHash(
      password,
      hashedPassword
    );

    if (this.passwordNotMatched(res)) {
      throw new BaseError(ErrorCode.WRONG_PASSWORD_OR_EMAIL);
    }
  }

  private passwordNotMatched(value: boolean) {
    return !value;
  }
}
