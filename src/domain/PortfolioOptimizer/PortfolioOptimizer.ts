import { Either, left, right } from '../../lib/Either';
import { PortfolioWithPrices } from '../PortfolioWithPrices/PortfolioWithPrices';
import { TickerWithPrice } from '../TickerWithPrice';
import {
  PortfolioOptimizerError,
  PortfolioOptimizerErrorCode,
} from './PortfolioOptimizerError';

export class PortfolioOptimizer {
  portfolio: PortfolioWithPrices;
  totalPriceWithAmountToInvest: number;

  private constructor(
    portfolio: PortfolioWithPrices,
    totalPriceWithAmountToInvest: number
  ) {
    this.portfolio = portfolio;
    this.totalPriceWithAmountToInvest = totalPriceWithAmountToInvest;
  }

  static from(
    portfolio: PortfolioWithPrices,
    amountToInvest: number
  ): Either<PortfolioOptimizerError, PortfolioOptimizer> {
    const totalPriceWithAmountToInvest = portfolio.totalPrice + amountToInvest;

    const [error, portfolioWithApproximateOptimization] =
      PortfolioOptimizer.approximateOptimization(
        portfolio,
        totalPriceWithAmountToInvest
      );

    if (error) {
      return left(error);
    }

    return right(
      new PortfolioOptimizer(
        portfolioWithApproximateOptimization,
        totalPriceWithAmountToInvest
      )
    );
  }

  static approximateOptimization(
    portfolio: PortfolioWithPrices,
    totalPriceWithAmountToInvest: number
  ): Either<PortfolioOptimizerError, PortfolioWithPrices> {
    const tickersWithApproximateAmount = portfolio.tickers.map((ticker) => {
      const updatedTicker = new TickerWithPrice({
        ...ticker,
        amount: Math.floor(
          (totalPriceWithAmountToInvest * ticker.percentageAimingTo -
            ticker.totalPrice) /
            ticker.price
        ),
      });

      return updatedTicker;
    });

    const [, updatedPortfolio] = PortfolioWithPrices.from([
      ...tickersWithApproximateAmount,
    ]);

    if (!updatedPortfolio) {
      return left(
        new PortfolioOptimizerError(PortfolioOptimizerErrorCode.CORRUPTED_DATA)
      );
    }

    return right(updatedPortfolio);
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
