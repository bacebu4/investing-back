import { Either, left, right } from '../../lib/Either';
import { isString } from '../../lib/guards/isString';
import { UserError, UserErrorCode } from './UserError';

export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly currency: Currency;
  readonly hashedPassword: string;

  private constructor({ id, email, currency, hashedPassword }: User) {
    this.id = id;
    this.email = email;
    this.currency = currency;
    this.hashedPassword = hashedPassword;
  }

  static from(obj: {
    id: unknown;
    email: unknown;
    currency: unknown;
    hashedPassword: unknown;
  }): Either<UserError[], User> {
    const errors: Array<UserError> = [];

    if (!isString(obj.id)) {
      errors.push(new UserError(UserErrorCode.WRONG_ID_FIELD));
    }

    if (!isString(obj.email)) {
      errors.push(new UserError(UserErrorCode.WRONG_EMAIL_FIELD));
    }

    if (!isString(obj.currency)) {
      errors.push(new UserError(UserErrorCode.WRONG_CURRENCY_FIELD));
    }

    if (isString(obj.currency) && !(obj.currency in Currency)) {
      errors.push(new UserError(UserErrorCode.NOT_SUPPORTED_CURRENCY_FIELD));
    }

    if (!isString(obj.hashedPassword)) {
      errors.push(new UserError(UserErrorCode.WRONG_PASSWORD_FIELD));
    }

    if (!errors.length) {
      return right(new User(obj as User));
    }

    return left(errors);
  }
}
