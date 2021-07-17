import { TickerSymbol } from '../../../domain/interfaces';
import { Either, left, right } from '../../../lib/Either';
import { Database } from '../../db';
import { Logger } from '../../logger/Logger';
import {
  SymbolRepositoryError,
  SymbolRepositoryErrorCode,
} from './SymbolRepositoryError';

export interface SymbolRepository {
  findOrCreate(
    symbol: string
  ): Promise<Either<SymbolRepositoryError, TickerSymbol>>;
}

export class SymbolRepositoryImpl implements SymbolRepository {
  constructor(private logger: Logger, private db: Database) {}

  public async findOrCreate(symbol: string) {
    const [, foundSymbol] = await this.find(symbol);

    if (foundSymbol) {
      return right(foundSymbol);
    }

    const [, successfullyCreated] = await this.create(
      symbol,
      `Cool name of ${symbol}`
    );

    if (successfullyCreated) {
      return right({ value: symbol, name: `Cool name of ${symbol}` });
    }

    return left(
      new SymbolRepositoryError(SymbolRepositoryErrorCode.UNEXPECTED_ERROR)
    );
  }

  private async find(symbol: string) {
    const [, foundSymbolEntity] = await this.db.query(
      /* sql */
      `
        SELECT
          *
        FROM
          symbol_entity
        WHERE
          symbol = $1
      `,
      [symbol]
    );

    if (foundSymbolEntity) {
      return right({
        value: foundSymbolEntity.symbol,
        name: foundSymbolEntity.name,
      });
    }

    return left(new SymbolRepositoryError(SymbolRepositoryErrorCode.NOT_FOUND));
  }

  private async create(symbol: string, name: string) {
    const [, success] = await this.db.query(
      /* sql */
      `
      INSERT INTO symbol_entity (symbol, "name")
        VALUES($1, $2)
    `,
      [symbol, name]
    );

    if (success) {
      return right({});
    }

    return left(
      new SymbolRepositoryError(SymbolRepositoryErrorCode.UNEXPECTED_ERROR)
    );
  }
}
