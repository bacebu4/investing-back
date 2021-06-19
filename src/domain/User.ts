import { Portfolio } from './Portfolio';

export enum Currency {
  Rub = 'RUB',
  Usd = 'USD',
}

export class User {
  id: string;
  email: string;
  currency: Currency;
  portfolio: Portfolio;

  constructor({ id, email, currency, portfolio }: Partial<User>) {
    this.id = id;
    this.email = email;
    this.currency = currency;
    this.portfolio = portfolio;
  }
}
