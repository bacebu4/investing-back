export enum PortfolioErrorCode {
  WRONG_PERCENTAGES = 'The sum of all end percentages should equal to 1',
}

export class PortfolioError extends Error {
  message: PortfolioErrorCode;

  constructor(message: PortfolioErrorCode) {
    super(message);
    this.message = message;
  }
}
