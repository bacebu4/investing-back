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
    const [, foundSymbolEntity] = await this.db.findSymbol(symbol);

    if (foundSymbolEntity) {
      return right({
        value: foundSymbolEntity.symbol,
        name: foundSymbolEntity.name,
      });
    }

    const [, created] = await this.db.createSymbol({
      symbol,
      name: `Cool name of ${symbol}`,
    });
    if (created) {
      return right({ value: symbol, name: `Cool name of ${symbol}` });
    }

    return left(new SymbolRepositoryError(SymbolRepositoryErrorCode.NOT_FOUND));
  }
}
