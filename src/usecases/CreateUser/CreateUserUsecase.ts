import { inject, injectable } from 'inversify';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { TYPES } from '../../infrastructure/container/types';
import { Usecase } from '../interface';
import { UUID } from '../../infrastructure/uuid/UUID';
import { Currency, User } from '../../domain/User';
import { Crypto } from '../../infrastructure/crypto/Crypto';
import { TokenService } from '../../infrastructure/token/TokenService';
import { UsecaseError, UsecaseErrorCode } from '../UsecaseError';
import { CreateUserDTO } from './CreateUserDTO';
import { Either, left, right } from '../../lib/Either';

export interface CreateUser extends Usecase {
  invoke(payload: CreateUserDTO): Promise<Either<UsecaseError[], string>>;
}

@injectable()
export class CreateUserImpl implements CreateUser {
  private email: string;
  private password: string;
  private currency: Currency;
  private errors: UsecaseError[] = [];

  public constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.UUID) private uuid: UUID,
    @inject(TYPES.Crypto) private crypto: Crypto,
    @inject(TYPES.TokenService) private tokenService: TokenService
  ) {}

  public async invoke({
    email,
    password,
    currency,
  }: CreateUserDTO): Promise<Either<UsecaseError[], string>> {
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
    return right(token.value);
  }

  private async validation() {
    await this.checkIfEmailTaken();
    this.validatePassword();
  }

  private async checkIfEmailTaken() {
    const [, emailTaken] = await this.userRepository.getByEmail(this.email);

    if (emailTaken) {
      this.errors.push(new UsecaseError(UsecaseErrorCode.USER_ALREADY_EXISTS));
    }
  }

  private validatePassword() {
    if (this.password.length < 4) {
      this.errors.push(new UsecaseError(UsecaseErrorCode.WEAK_PASSWORD));
    }
  }

  private hasErrors() {
    return this.errors.length;
  }

  private async formNewUser() {
    const userId = this.uuid.generate();
    const hashedPassword = await this.crypto.generateHash(this.password);
    return new User({
      id: userId,
      email: this.email,
      currency: this.currency,
      hashedPassword,
    });
  }
}
