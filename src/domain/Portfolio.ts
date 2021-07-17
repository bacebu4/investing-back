import { ErrorCode, BaseError } from './Error';
import { TickerWithPrice } from './TickerWithPrice';

export class Portfolio implements Portfolio {
  public tickers: TickerWithPrice[];

  constructor(tickers: TickerWithPrice[]) {
    this.tickers = tickers;
  }

  get totalPrice() {
    return this.tickers.reduce((acc, val) => acc + val.totalPrice, 0);
  }

  findTickerById(id: string) {
    const tickerIndex = this.tickers.findIndex(
      ({ id: tickerId }) => tickerId === id
    );

    if (tickerIndex === -1) {
      throw new BaseError(ErrorCode.CORRUPTED);
    }

    return this.tickers[tickerIndex];
  }

  percentageOfTickerById(id: string) {
    const ticker = this.findTickerById(id);

    return ticker.totalPrice / this.totalPrice;
  }

  relativePercentageOfTickerById(id: string) {
    const ticker = this.findTickerById(id);

    return (
      (ticker.percentageAimingTo - this.percentageOfTickerById(id)) /
      ticker.percentageAimingTo
    );
  }

  addOneTickerById(id: string) {
    const ticker = this.findTickerById(id);
    ticker.amount += 1;
  }

  removeTickerAmountById(id: string) {
    const ticker = this.findTickerById(id);
    ticker.amount -= 1;
  }

  get tickersWithAnalytics() {
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
