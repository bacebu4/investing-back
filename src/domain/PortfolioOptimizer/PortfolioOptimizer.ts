import { Portfolio } from '../Portfolio/Portfolio';
import { TickerWithPrice } from '../TickerWithPrice';
import {
  PortfolioOptimizerError,
  PortfolioOptimizerErrorCode,
} from './PortfolioOptimizerError';

// TODO should not throw + private constructor
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
      const [, relativePercentageOfTicker] =
        this.portfolio.relativePercentageOfTickerById(ticker.id);

      const initialRelativeAbsPercentage = Math.abs(relativePercentageOfTicker);
      let nextRelativeAbsPercentage: number;

      do {
        this.portfolio.addOneTickerById(ticker.id);

        const [, nextRelativePercentage] =
          this.portfolio.relativePercentageOfTickerById(ticker.id);

        nextRelativeAbsPercentage = Math.abs(nextRelativePercentage);
      } while (
        nextRelativeAbsPercentage < initialRelativeAbsPercentage &&
        this.portfolio.totalPrice < this.totalPriceWithAmountToInvest
      );

      this.portfolio.removeTickerAmountById(ticker.id);
    });
  }
}
