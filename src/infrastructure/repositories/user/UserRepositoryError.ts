export enum UserRepositoryErrorCode {
  NOT_FOUND = 'The record was not found',
}

export class UserRepositoryError extends Error {
  message: UserRepositoryErrorCode;

  constructor(message: UserRepositoryErrorCode) {
    super(message);
    this.message = message;
  }
}
