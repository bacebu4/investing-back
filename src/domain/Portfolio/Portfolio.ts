import { Either, left, right } from '../../lib/Either';
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

  private findTickerById(id: string): Either<PortfolioError, TickerWithPrice> {
    const tickerIndex = this.tickers.findIndex(
      ({ id: tickerId }) => tickerId === id
    );

    if (tickerIndex === -1) {
      return left(new PortfolioError(PortfolioErrorCode.NOT_EXISTING_ID));
    }

    return right(this.tickers[tickerIndex]);
  }

  private percentageOfTickerById(id: string) {
    const [error, ticker] = this.findTickerById(id);

    if (ticker) {
      return right(ticker.totalPrice / this.totalPrice);
    }

    return left(error);
  }

  public relativePercentageOfTickerById(id: string) {
    const [error, ticker] = this.findTickerById(id);
    const [, percentageOfTickerById] = this.percentageOfTickerById(id);

    if (ticker && percentageOfTickerById) {
      return right(
        (ticker.percentageAimingTo - percentageOfTickerById) /
          ticker.percentageAimingTo
      );
    }

    return left(error);
  }

  public addOneTickerById(id: string) {
    const [error, ticker] = this.findTickerById(id);

    if (ticker) {
      ticker.amount += 1;
      return right(true);
    }

    return left(error);
  }

  public removeTickerAmountById(id: string) {
    const [error, ticker] = this.findTickerById(id);

    if (ticker) {
      ticker.amount -= 1;
      return right(true);
    }

    return left(error);
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
