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
