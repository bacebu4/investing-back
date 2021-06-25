import { inject, injectable } from 'inversify';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { TYPES } from '../infrastructure/container/types';
import { Usecase } from './interface';
import { UUID } from '../infrastructure/uuid/UUID';
import { Currency, User } from '../domain/User';
import { Crypto } from '../infrastructure/crypto/Crypto';
import { TokenService } from '../infrastructure/token/TokenService';
import { BaseError, ErrorCode } from '../domain/Error';

type Payload = { email: string; password: string; currency: Currency };
export interface CreateUser extends Usecase {
  invoke(payload: Payload): Promise<string>;
}

@injectable()
export class CreateUserImpl implements CreateUser {
  private email: string;
  private password: string;
  private currency: Currency;

  public constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.UUID) private uuid: UUID,
    @inject(TYPES.Crypto) private crypto: Crypto,
    @inject(TYPES.TokenService) private tokenService: TokenService
  ) {}

  public async invoke({ email, password, currency }: Payload) {
    this.email = email;
    this.password = password;
    this.currency = currency;

    await this.checkIfEmailTaken();
    this.validatePassword();

    const userId = this.uuid.generate();
    const hashedPassword = await this.crypto.generateHash(password);

    const user = new User({ id: userId, email, currency, hashedPassword });
    await this.userRepository.save(user);

    const token = this.tokenService.signWithUserId(userId);
    return token;
  }

  private async checkIfEmailTaken() {
    const user = await this.userRepository.getByEmail(this.email);
    if (user) {
      throw new BaseError(ErrorCode.USER_ALREADY_EXISTS);
    }
  }

  private validatePassword() {
    if (this.password.length < 4) {
      throw new BaseError(ErrorCode.WEAK_PASSWORD);
    }
  }
}
