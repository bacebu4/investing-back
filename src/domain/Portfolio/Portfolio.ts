import { Either, left, right } from '../../lib/Either';
import { Ticker } from '../interfaces';
import { PortfolioError, PortfolioErrorCode } from './PortfolioError';

export class Portfolio {
  public tickers: Ticker[];

  private constructor(tickers: Ticker[]) {
    this.tickers = tickers;
  }

  static from(tickers: Ticker[]): Either<PortfolioError, Portfolio> {
    const sumOfAllPercentagesAimingTo = tickers.reduce(
      (acc, val) => acc + val.percentageAimingTo,
      0
    );

    if (parseFloat(sumOfAllPercentagesAimingTo.toFixed(2)) !== 1) {
      return left(new PortfolioError(PortfolioErrorCode.WRONG_PERCENTAGES));
    }

    return right(new Portfolio(tickers));
  }
}
