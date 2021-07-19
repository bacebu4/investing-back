import { Either, left, right } from '../../lib/Either';
import { isString } from '../../lib/guards/isString';

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
  }): Either<string[], User> {
    const errors: Array<string> = [];

    if (!isString(obj.id)) {
      errors.push('`id` field should be string');
    }

    if (!isString(obj.email)) {
      errors.push('`email` field should be string');
    }

    if (!isString(obj.currency)) {
      errors.push('`currency` field should be string');
    }

    if (isString(obj.currency) && !(obj.currency in Currency)) {
      errors.push('`currency` field should be a valid currency');
    }

    if (!isString(obj.hashedPassword)) {
      errors.push('`hashedPassword` field should be string');
    }

    if (!errors.length) {
      return right(new User(obj as User));
    }

    return left(errors);
  }
}
