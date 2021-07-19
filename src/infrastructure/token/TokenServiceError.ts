export enum TokenServiceErrorCode {
  NOT_VALID = 'The token is not valid',
  UNEXPECTED_ERROR = 'Unexpected error occurred. The token was decoded but the required field was not found',
}

export class TokenServiceError extends Error {
  message: TokenServiceErrorCode;

  constructor(message: TokenServiceErrorCode) {
    super(message);
    this.message = message;
  }
}
