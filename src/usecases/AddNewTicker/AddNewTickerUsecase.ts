import { SymbolRepository } from '../../infrastructure/repositories/symbol/SymbolRepository';
import { UserRepository } from '../../infrastructure/repositories/user/UserRepository';
import { TokenService } from '../../infrastructure/token/TokenService';
import { UUID } from '../../infrastructure/uuid/UUID';
import { Either, left, right } from '../../lib/Either';
import { Usecase } from '../interface';
import { AddNewTickerDTO } from './AddNewTickerDTO';
import { AddNewTickerError, AddNewTickerErrorCode } from './AddNewTickerError';

export interface AddNewTicker extends Usecase {
  invoke(
    payload: AddNewTickerDTO,
    tokenValue: string
  ): Promise<Either<AddNewTickerError[], boolean>>;
}

// TODO the max percentage aiming to is 1. Use `Portfolio` from domain
export class AddNewTickerImpl implements AddNewTicker {
  private symbol: string;
  private initialAmount: number;
  private errors: AddNewTickerError[] = [];
  private userId: string;

  public constructor(
    private uuid: UUID,
    private tokenService: TokenService,
    private userRepo: UserRepository,
    private symbolRepo: SymbolRepository
  ) {}

  public async invoke(
    { symbol, initialAmount, percentageAimingTo }: AddNewTickerDTO,
    tokenValue: string
  ) {
    this.symbol = symbol;
    this.initialAmount = initialAmount;
    this.userId = this.tokenService.verifyAndGetUserId(tokenValue);

    const [, validSymbol] = await this.symbolRepo.findOrCreate(this.symbol);

    const [, foundUser] = await this.userRepo.getById(this.userId);

    const [, foundTickerIdInPortfolio] =
      await this.userRepo.getTickerIdBySymbolName({
        symbol: this.symbol,
        userId: this.userId,
      });

    if (foundTickerIdInPortfolio) {
      this.errors.push(
        new AddNewTickerError(AddNewTickerErrorCode.ALREADY_EXISTS)
      );
    }

    if (!validSymbol) {
      this.errors.push(new AddNewTickerError(AddNewTickerErrorCode.NOT_FOUND));
    }

    if (!foundUser) {
      this.errors.push(
        new AddNewTickerError(AddNewTickerErrorCode.USER_NOT_EXISTS)
      );
    }

    if (!this.errors.length) {
      const [, successfullyAdded] = await this.userRepo.saveTicker(
        {
          amount: this.initialAmount,
          symbol: validSymbol,
          id: this.uuid.generate(),
          percentageAimingTo,
        },
        foundUser.id
      );

      if (successfullyAdded) {
        return right(true);
      }
    }

    return left(this.errors);
  }
}
