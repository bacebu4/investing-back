import { Currency } from '../../domain/User/User';

export interface CreateUserDTO {
  email: string;
  password: string;
  currency: Currency;
}
