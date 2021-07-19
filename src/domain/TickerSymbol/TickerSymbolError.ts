export enum TickerSymbolErrorCode {
  INVALID_VALUE = 'The value of the ticker is invalid',
  INVALID_NAME = 'The name should be a string',
}

export class TickerSymbolError extends Error {
  message: TickerSymbolErrorCode;

  constructor(message: TickerSymbolErrorCode) {
    super(message);
    this.message = message;
  }
}
