export enum ErrorCode {
  CORRUPTED = 'Your data might be corrupted. Contact the support.',
}

export class BaseError extends Error {
  message: ErrorCode;

  constructor(message: ErrorCode) {
    super(message);
    this.message = message;
  }
}
