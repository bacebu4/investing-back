export enum UserRepositoryErrorCode {
  NOT_FOUND = 'The record was not found',
  UNEXPECTED_ERROR = 'The unexpected error occurred',
  CORRUPTED_DATA = 'The data was corrupted',
}

export class UserRepositoryError extends Error {
  message: UserRepositoryErrorCode;

  constructor(message: UserRepositoryErrorCode) {
    super(message);
    this.message = message;
  }
}
