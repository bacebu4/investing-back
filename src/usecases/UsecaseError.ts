export enum UsecaseErrorCode {
  USER_ALREADY_EXISTS = 'User already exists',
  WEAK_PASSWORD = 'Password is weak.',
}

export class UsecaseError extends Error {
  message: UsecaseErrorCode;

  constructor(message: UsecaseErrorCode) {
    super(message);
    this.message = message;
  }
}
