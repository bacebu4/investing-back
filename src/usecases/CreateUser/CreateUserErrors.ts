export enum CreateUserErrorCode {
  USER_ALREADY_EXISTS = 'User already exists',
  WEAK_PASSWORD = 'Password is weak.',
}

export class CreateUserError extends Error {
  message: CreateUserErrorCode;

  constructor(message: CreateUserErrorCode) {
    super(message);
    this.message = message;
  }
}
