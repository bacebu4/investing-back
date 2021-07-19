export enum AddNewTickerErrorCode {
  NOT_FOUND = 'Ticker was not found',
  ALREADY_EXISTS = 'The requested ticker already included in the portfolio',
  USER_NOT_EXISTS = 'The user does not exist',
  NOT_AUTHORIZED = 'The authorization failed. Make sure you are submitting a token.',
}

export class AddNewTickerError extends Error {
  message: AddNewTickerErrorCode;

  constructor(message: AddNewTickerErrorCode) {
    super(message);
    this.message = message;
  }
}
