import { Either, left, right } from '../../lib/Either';
import { isString } from '../../lib/guards/isString';
import { TickerSymbolError, TickerSymbolErrorCode } from './TickerSymbolError';

export class TickerSymbol {
  constructor(public value: string, public name: string) {}

  from({
    value,
    name,
  }: {
    value: unknown;
    name: unknown;
  }): Either<TickerSymbolError[], TickerSymbol> {
    const errors: TickerSymbolError[] = [];

    if (!isString(value)) {
      errors.push(new TickerSymbolError(TickerSymbolErrorCode.INVALID_VALUE));
    }

    if (!isString(name)) {
      errors.push(new TickerSymbolError(TickerSymbolErrorCode.INVALID_NAME));
    }

    if (errors.length === 0) {
      return right(new TickerSymbol(value as string, name as string));
    }

    return left(errors);
  }
}
