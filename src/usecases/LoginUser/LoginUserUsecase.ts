import { UserRepository } from '../../infrastructure/repositories/user/UserRepository';
import { Usecase } from '../interface';
import { Crypto } from '../../infrastructure/crypto/Crypto';
import { TokenService } from '../../infrastructure/token/TokenService';
import { Either, left, right } from '../../lib/Either';
import { LoginUserDTO } from './LoginUserDTO';
import { User } from '../../domain/User/User';
import { Logger } from '../../infrastructure/logger/Logger';
import { LoginUserError, LoginUserErrorCode } from './LoginUserErrors';
import { Token } from '../../domain/Token';

export interface LoginUser extends Usecase {
  invoke(payload: LoginUserDTO): Promise<Either<LoginUserError[], Token>>;
}

export class LoginUserImpl implements LoginUser {
  private email: string;
  private password: string;
  private errors: LoginUserError[] = [];

  public constructor(
    private userRepository: UserRepository,
    private crypto: Crypto,
    private tokenService: TokenService,
    private logger: Logger
  ) {}

  public async invoke({ email, password }: LoginUserDTO) {
    this.email = email;
    this.password = password;

    const user = await this.getUser();

    if (this.hasErrors()) {
      return left(this.errors);
    }

    await this.validatePassword(user);

    if (this.hasErrors()) {
      return left(this.errors);
    }

    const token = this.tokenService.signWithUserId(user.id);
    return right(token);
  }

  private hasErrors() {
    return this.errors.length;
  }

  private async getUser() {
    const [error, user] = await this.userRepository.getByEmail(this.email);

    if (error) {
      this.errors.push(
        new LoginUserError(LoginUserErrorCode.WRONG_EMAIL_OR_PASSWORD)
      );
    }

    return user;
  }

  private async validatePassword(user: User) {
    const validPassword = await this.crypto.compareValueWithHash(
      this.password,
      user.hashedPassword
    );

    if (!validPassword) {
      this.errors.push(
        new LoginUserError(LoginUserErrorCode.WRONG_EMAIL_OR_PASSWORD)
      );
    }
  }
}
