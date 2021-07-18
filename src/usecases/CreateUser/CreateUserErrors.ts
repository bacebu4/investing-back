export enum CreateUserErrorCode {
  USER_ALREADY_EXISTS = 'User already exists',
  WEAK_PASSWORD = 'Password is weak.',
  CORRUPTED_DATA = 'The data was corrupted during the execution of usecase',
}

export class CreateUserError extends Error {
  message: CreateUserErrorCode;

  constructor(message: CreateUserErrorCode) {
    super(message);
    this.message = message;
  }
}
