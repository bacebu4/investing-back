import { UserRepository } from '../../infrastructure/repositories/user/UserRepository';
import { Usecase } from '../interface';
import { UUID } from '../../infrastructure/uuid/UUID';
import { Currency, User } from '../../domain/User/User';
import { Crypto } from '../../infrastructure/crypto/Crypto';
import { TokenService } from '../../infrastructure/token/TokenService';
import { CreateUserDTO } from './CreateUserDTO';
import { Either, left, right } from '../../lib/Either';
import { CreateUserError, CreateUserErrorCode } from './CreateUserErrors';
import { Token } from '../../domain/Token';

export interface CreateUser extends Usecase {
  invoke(payload: CreateUserDTO): Promise<Either<CreateUserError[], Token>>;
}

export class CreateUserImpl implements CreateUser {
  private email: string;
  private password: string;
  private currency: Currency;
  private errors: CreateUserError[] = [];

  public constructor(
    private userRepository: UserRepository,
    private uuid: UUID,
    private crypto: Crypto,
    private tokenService: TokenService
  ) {}

  public async invoke({ email, password, currency }: CreateUserDTO) {
    this.email = email;
    this.password = password;
    this.currency = currency;

    await this.validation();

    if (this.hasErrors()) {
      return left(this.errors);
    }

    const user = await this.formNewUser();

    await this.userRepository.save(user);

    const token = this.tokenService.signWithUserId(user.id);
    return right(token);
  }

  private async validation() {
    await this.checkIfEmailTaken();
    this.validatePassword();
  }

  private async checkIfEmailTaken() {
    const [, emailTaken] = await this.userRepository.getByEmail(this.email);

    if (emailTaken) {
      this.errors.push(
        new CreateUserError(CreateUserErrorCode.USER_ALREADY_EXISTS)
      );
    }
  }

  private validatePassword() {
    if (this.password.length < 4) {
      this.errors.push(new CreateUserError(CreateUserErrorCode.WEAK_PASSWORD));
    }
  }

  private hasErrors() {
    return this.errors.length;
  }

  private async formNewUser() {
    const userId = this.uuid.generate();
    const hashedPassword = await this.crypto.generateHash(this.password);

    const [, user] = User.from({
      id: userId,
      email: this.email,
      currency: this.currency,
      hashedPassword,
    });

    if (!user) {
      throw new CreateUserError(CreateUserErrorCode.CORRUPTED_DATA);
    }

    return user;
  }
}
