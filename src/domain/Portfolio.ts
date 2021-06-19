import { ErrorCode, ErrorImpl } from './Error';
import { Ticker } from './Ticker';

export interface Portfolio {
  tickers: Ticker[];
  totalPrice: number;
  percentageOfTickerById(id: string): number;
  relativePercentageOfTickerById(id: string): number;
  addOneTickerById(id: string): void;
  removeTickerAmountById(id: string): void;
  findTickerById(id: string): Ticker;
  tickersWithAnalytics: Array<
    Ticker & {
      totalPriceAimingTo: number;
      relativePercentage: number;
      percentage: number;
    }
  >;
}

export class PortfolioImpl implements Portfolio {
  public tickers;

  constructor(tickers: Ticker[]) {
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
      throw new ErrorImpl(ErrorCode.CORRUPTED);
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
