import { Currency } from '../../domain/User';

export interface CreateUserDTO {
  email: string;
  password: string;
  currency: Currency;
}
