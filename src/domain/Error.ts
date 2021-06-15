export enum ErrorCode {
  UNAUTHENTICATED,
  USER_ALREADY_EXISTS,
  WRONG_PASSWORD_OR_EMAIL,
  CORRUPTED,
}

interface IError {
  errorCode: ErrorCode;
  message: string;
}

export class ErrorImpl extends Error implements IError {
  errorCode: ErrorCode;

  constructor(errorCode: ErrorCode) {
    super('An unexpected error occurred');
    this.errorCode = errorCode;
  }

  get message() {
    switch (this.errorCode) {
      case ErrorCode.UNAUTHENTICATED:
        return 'Forbidden';

      case ErrorCode.USER_ALREADY_EXISTS:
        return 'User already exists';

      case ErrorCode.WRONG_PASSWORD_OR_EMAIL:
        return 'Wrong password of email';

      case ErrorCode.CORRUPTED:
        return 'Your data might be corrupted. Contact the support.';

      default:
        return 'An unexpected error occurred';
    }
  }
}
