export enum UserErrorCode {
  WRONG_ID_FIELD = '`id` field should be string',
  WRONG_EMAIL_FIELD = '`email` field should be string',
  WRONG_CURRENCY_FIELD = '`currency` field should be string',
  NOT_SUPPORTED_CURRENCY_FIELD = '`currency` field should be a valid currency',
  WRONG_PASSWORD_FIELD = '`hashedPassword` field should be string',
}

export class UserError extends Error {
  message: UserErrorCode;

  constructor(message: UserErrorCode) {
    super(message);
    this.message = message;
  }
}
