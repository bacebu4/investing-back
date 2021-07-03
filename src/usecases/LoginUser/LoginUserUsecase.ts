import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { Usecase } from '../interface';
import { Crypto } from '../../infrastructure/crypto/Crypto';
import { TokenService } from '../../infrastructure/token/TokenService';
import { UsecaseError, UsecaseErrorCode } from '../UsecaseError';
import { Either, left, right } from '../../lib/Either';
import { LoginUserDTO } from './LoginUserDTO';
import { User } from '../../domain/User';

export interface LoginUser extends Usecase {
  invoke(payload: LoginUserDTO): Promise<Either<UsecaseError[], string>>;
}

export class LoginUserImpl implements LoginUser {
  private email: string;
  private password: string;
  private errors: UsecaseError[] = [];

  public constructor(
    private userRepository: UserRepository,
    private crypto: Crypto,
    private tokenService: TokenService
  ) {}

  public async invoke({
    email,
    password,
  }: LoginUserDTO): Promise<Either<UsecaseError[], string>> {
    this.email = email;
    this.password = password;

    const user = await this.getUser();

    if (this.hasErrors()) {
      return left(this.errors);
    }

    this.validatePassword(user);

    if (this.hasErrors()) {
      return left(this.errors);
    }

    const token = this.tokenService.signWithUserId(user.id);
    return right(token.value);
  }

  private hasErrors() {
    return this.errors.length;
  }

  private async getUser() {
    const [error, user] = await this.userRepository.getByEmail(this.email);

    if (error) {
      this.errors.push(
        new UsecaseError(UsecaseErrorCode.WRONG_EMAIL_OR_PASSWORD)
      );
    }

    return user;
  }

  private validatePassword(user: User) {
    const validPassword = this.crypto.compareValueWithHash(
      this.password,
      user.hashedPassword
    );

    if (!validPassword) {
      this.errors.push(
        new UsecaseError(UsecaseErrorCode.WRONG_EMAIL_OR_PASSWORD)
      );
    }
  }
}
