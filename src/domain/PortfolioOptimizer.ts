import { Portfolio } from './Portfolio';
import { Ticker } from './Ticker';

export class PortfolioOptimizer {
  portfolio: Portfolio;
  amountToInvest: number;
  totalPriceWithAmountToInvest: number;

  constructor(portfolio: Portfolio, amountToInvest: number) {
    this.amountToInvest = amountToInvest;

    this.totalPriceWithAmountToInvest = portfolio.totalPrice + amountToInvest;

    const tickersWithApproximateAmount = portfolio.tickers.map((ticker) => {
      const updatedTicker = new Ticker({
        ...ticker,
        amount: Math.floor(
          (this.totalPriceWithAmountToInvest * ticker.percentageAimingTo -
            ticker.totalPrice) /
            ticker.price
        ),
      });

      return updatedTicker;
    });

    this.portfolio = new Portfolio([...tickersWithApproximateAmount]);
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
