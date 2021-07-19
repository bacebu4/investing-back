import { isInteger } from '../../lib/guards/isInteger';
import { isNumber } from '../../lib/guards/isNumber';
import { isString } from '../../lib/guards/isString';
import { TickerSymbol } from '../TickerSymbol/TickerSymbol';
import { TickerError, TickerErrorCode } from './TickerError';

export class Ticker {
  constructor(
    public amount: number,
    public symbol: TickerSymbol,
    public id: string,
    public percentageAimingTo: number
  ) {}

  static from({
    amount,
    symbol,
    id,
    percentageAimingTo,
  }: {
    amount: unknown;
    symbol: unknown;
    id: unknown;
    percentageAimingTo: unknown;
  }) {
    const errors: TickerError[] = [];

    if (!isNumber(amount)) {
      errors.push(new TickerError(TickerErrorCode.INVALID_AMOUNT_TYPE));
    } else {
      if (!isInteger(amount)) {
        errors.push(
          new TickerError(TickerErrorCode.INVALID_AMOUNT_NUMBER_TYPE)
        );
      }
    }

    if (!(symbol instanceof TickerSymbol)) {
      errors.push(new TickerError(TickerErrorCode.INVALID_SYMBOL));
    }

    if (!isString(id)) {
      errors.push(new TickerError(TickerErrorCode.INVALID_ID));
    }

    if (!isNumber(percentageAimingTo)) {
      errors.push(new TickerError(TickerErrorCode.INVALID_PERCENTAGE_TYPE));
    } else {
      if (percentageAimingTo > 1) {
        errors.push(new TickerError(TickerErrorCode.INVALID_PERCENTAGE_VALUE));
      }
    }

    if (!errors.length) {
      return new Ticker(
        amount as number,
        symbol as TickerSymbol,
        id as string,
        percentageAimingTo as number
      );
    }
  }
}
