export enum ErrorCode {
  UNAUTHENTICATED = 'Forbidden',
  USER_ALREADY_EXISTS = 'User already exists',
  WRONG_PASSWORD_OR_EMAIL = 'Wrong password of email',
  CORRUPTED = 'Your data might be corrupted. Contact the support.',
  NOT_ESTABLISHED_DB_CONNECTION = 'DB connection was not established yet.',
}

export class BaseError extends Error {
  message: ErrorCode;

  constructor(message: ErrorCode) {
    super(message);
    this.message = message;
  }
}
