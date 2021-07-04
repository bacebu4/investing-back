export enum Currency {
  Rub = 'RUB',
  Usd = 'USD',
}

export class User {
  id: string;
  email: string;
  currency: Currency;
  hashedPassword: string;

  constructor({ id, email, currency, hashedPassword }: User) {
    this.id = id;
    this.email = email;
    this.currency = currency;
    this.hashedPassword = hashedPassword;
  }
}
