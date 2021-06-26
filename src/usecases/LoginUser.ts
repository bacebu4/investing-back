import { inject, injectable } from 'inversify';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { TYPES } from '../infrastructure/container/types';
import { Usecase } from './interface';
import { Crypto } from '../infrastructure/crypto/Crypto';
import { TokenService } from '../infrastructure/token/TokenService';
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
  private receivedPassword: string;
  private hashedPassword: string;

  public constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.Crypto) private crypto: Crypto,
    @inject(TYPES.TokenService) private auth: TokenService
  ) {}

  public async invoke({ email, password }: Payload) {
    // this.receivedPassword = password;

    // const { hashedPassword, id: userId } = await this.userRepository.getByEmail(
    //   email
    // );
    // this.hashedPassword = hashedPassword;

    // await this.validateReceivedPassword();

    // return this.auth.signWithUserId(userId).value;
    return '123';
  }

  private async validateReceivedPassword() {
    const res = await this.crypto.compareValueWithHash(
      this.receivedPassword,
      this.hashedPassword
    );

    if (this.passwordNotMatched(res)) {
      throw new BaseError(ErrorCode.WRONG_PASSWORD_OR_EMAIL);
    }
  }

  private passwordNotMatched(value: boolean) {
    return !value;
  }
}
