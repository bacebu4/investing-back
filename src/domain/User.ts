import { Portfolio } from './Portfolio';

export interface User {
  id: string;
  email: string;
  currency: Currency;
  portfolio?: Portfolio;
}

export enum Currency {
  Rub = 'RUB',
  Usd = 'USD',
}

export class UserImpl implements User {
  id;
  email;
  currency;
  portfolio;
  constructor({ id, email, currency, portfolio }: User) {
    this.id = id;
    this.email = email;
    this.currency = currency;
    this.portfolio = portfolio;
  }
}
