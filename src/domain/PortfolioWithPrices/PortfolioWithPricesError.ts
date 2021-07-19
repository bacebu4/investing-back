export enum PortfolioWithPricesErrorCode {
  WRONG_PERCENTAGES = 'The sum of all end percentages should equal to 1',
  NOT_EXISTING_ID = 'The requested id was not found. The data might be corrupted',
}

export class PortfolioWithPricesError extends Error {
  message: PortfolioWithPricesErrorCode;

  constructor(message: PortfolioWithPricesErrorCode) {
    super(message);
    this.message = message;
  }
}
