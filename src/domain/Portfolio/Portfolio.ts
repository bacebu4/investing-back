import { Either, left, right } from '../../lib/Either';
import { ErrorCode, BaseError } from '../Error';
import { TickerWithPrice } from '../TickerWithPrice';
import { PortfolioError, PortfolioErrorCode } from './PortfolioError';

// TODO  tickers don't exist without portfolio + portfolio with prices should exist as well
export class Portfolio implements Portfolio {
  public tickers: TickerWithPrice[];

  private constructor(tickers: TickerWithPrice[]) {
    this.tickers = tickers;
  }

  static from(tickers: TickerWithPrice[]): Either<PortfolioError, Portfolio> {
    const sumOfAllPercentagesAimingTo = tickers.reduce(
      (acc, val) => acc + val.percentageAimingTo,
      0
    );

    if (parseFloat(sumOfAllPercentagesAimingTo.toFixed(2)) !== 1) {
      return left(new PortfolioError(PortfolioErrorCode.WRONG_PERCENTAGES));
    }

    return right(new Portfolio(tickers));
  }

  public get totalPrice() {
    return this.tickers.reduce((acc, val) => acc + val.totalPrice, 0);
  }

  // TODO should return either
  private findTickerById(id: string) {
    const tickerIndex = this.tickers.findIndex(
      ({ id: tickerId }) => tickerId === id
    );

    if (tickerIndex === -1) {
      throw new BaseError(ErrorCode.CORRUPTED);
    }

    return this.tickers[tickerIndex];
  }

  private percentageOfTickerById(id: string) {
    const ticker = this.findTickerById(id);

    return ticker.totalPrice / this.totalPrice;
  }

  public relativePercentageOfTickerById(id: string) {
    const ticker = this.findTickerById(id);

    return (
      (ticker.percentageAimingTo - this.percentageOfTickerById(id)) /
      ticker.percentageAimingTo
    );
  }

  public addOneTickerById(id: string) {
    const ticker = this.findTickerById(id);
    ticker.amount += 1;
  }

  public removeTickerAmountById(id: string) {
    const ticker = this.findTickerById(id);
    ticker.amount -= 1;
  }

  public get tickersWithAnalytics() {
    return this.tickers.map((ticker) => {
      const percentage = ticker.totalPrice / this.totalPrice;
      const relativePercentage =
        (ticker.percentageAimingTo - percentage) / ticker.percentageAimingTo;

      return {
        ...ticker,
        percentage,
        relativePercentage,
        totalPriceAimingTo: this.totalPrice * ticker.percentageAimingTo,
      };
    });
  }
}
