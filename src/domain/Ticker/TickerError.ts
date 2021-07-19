export enum TickerErrorCode {
  INVALID_AMOUNT_TYPE = '`amount` should be number',
  INVALID_AMOUNT_NUMBER_TYPE = '`amount` should be an integer',
  INVALID_SYMBOL = '`symbol` should be instance of `TickerSymbol`',
  INVALID_ID = '`id` should be a string',
  INVALID_PERCENTAGE_TYPE = '`percentageAimingTo` should be a number',
  INVALID_PERCENTAGE_VALUE = '`percentageAimingTo` should be less than 1',
}

export class TickerError extends Error {
  message: TickerErrorCode;

  constructor(message: TickerErrorCode) {
    super(message);
    this.message = message;
  }
}
