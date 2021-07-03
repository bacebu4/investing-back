export enum LoginUserErrorCode {
  WRONG_EMAIL_OR_PASSWORD = 'Wrong email or password',
}

export class LoginUserError extends Error {
  message: LoginUserErrorCode;

  constructor(message: LoginUserErrorCode) {
    super(message);
    this.message = message;
  }
}
