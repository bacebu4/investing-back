export enum ErrorCode {
  UNAUTHENTICATED,
  USER_ALREADY_EXISTS,
  WRONG_PASSWORD_OR_EMAIL,
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

      default:
        return 'An unexpected error occurred';
    }
  }
}
