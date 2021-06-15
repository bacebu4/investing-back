export enum ErrorCode {
  UNAUTHENTICATED = 'Forbidden',
  USER_ALREADY_EXISTS = 'User already exists',
  WRONG_PASSWORD_OR_EMAIL = 'Wrong password of email',
  CORRUPTED = 'Your data might be corrupted. Contact the support.',
}

export class ErrorImpl extends Error {
  message: ErrorCode;

  constructor(message: ErrorCode) {
    super(message);
    this.message = message;
  }
}
