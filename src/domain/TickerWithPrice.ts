import { Ticker, TickerSymbol } from './interfaces';

export class TickerWithPrice implements Ticker {
  price: number;
  amount: number;
  symbol: TickerSymbol;
  id: string;
  percentageAimingTo: number;

  constructor({
    price,
    amount,
    symbol,
    id,
    percentageAimingTo,
  }: Omit<TickerWithPrice, 'totalPrice'>) {
    this.price = price;
    this.amount = amount;
    this.symbol = symbol;
    this.id = id;
    this.percentageAimingTo = percentageAimingTo;
  }

  get totalPrice() {
    return this.price * this.amount;
  }
}
