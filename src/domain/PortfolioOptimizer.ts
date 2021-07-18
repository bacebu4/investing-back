import { Portfolio } from './Portfolio';
import { TickerWithPrice } from './TickerWithPrice';

export enum PortfolioOptimizerErrorCode {
  CORRUPTED_DATA = 'The data was corrupted during the portfolio optimization',
}

export class PortfolioOptimizerError extends Error {
  message: PortfolioOptimizerErrorCode;

  constructor(message: PortfolioOptimizerErrorCode) {
    super(message);
    this.message = message;
  }
}

// TODO should not throw + private constructor + create separate directory
export class PortfolioOptimizer {
  portfolio: Portfolio;
  amountToInvest: number;
  totalPriceWithAmountToInvest: number;

  constructor(portfolio: Portfolio, amountToInvest: number) {
    this.amountToInvest = amountToInvest;

    this.totalPriceWithAmountToInvest = portfolio.totalPrice + amountToInvest;

    const tickersWithApproximateAmount = portfolio.tickers.map((ticker) => {
      const updatedTicker = new TickerWithPrice({
        ...ticker,
        amount: Math.floor(
          (this.totalPriceWithAmountToInvest * ticker.percentageAimingTo -
            ticker.totalPrice) /
            ticker.price
        ),
      });

      return updatedTicker;
    });

    const [, portfolioUpdated] = Portfolio.from([
      ...tickersWithApproximateAmount,
    ]);

    if (!portfolioUpdated) {
      throw new PortfolioOptimizerError(
        PortfolioOptimizerErrorCode.CORRUPTED_DATA
      );
    }

    this.portfolio = portfolioUpdated;
  }

  optimize() {
    this.portfolio.tickers.forEach((ticker) => {
      const initialRelativeAbsPercentage = Math.abs(
        this.portfolio.relativePercentageOfTickerById(ticker.id)
      );
      let nextRelativeAbsPercentage: number;

      do {
        this.portfolio.addOneTickerById(ticker.id);
        nextRelativeAbsPercentage = Math.abs(
          this.portfolio.relativePercentageOfTickerById(ticker.id)
        );
      } while (
        nextRelativeAbsPercentage < initialRelativeAbsPercentage &&
        this.portfolio.totalPrice < this.totalPriceWithAmountToInvest
      );

      this.portfolio.removeTickerAmountById(ticker.id);
    });
  }
}
