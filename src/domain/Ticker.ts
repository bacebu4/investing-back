export class Ticker {
  price: number;
  amount: number;
  name: string;
  id: string;
  percentageAimingTo: number;

  constructor({
    price,
    amount,
    name,
    id,
    percentageAimingTo,
  }: Omit<Ticker, 'totalPrice'>) {
    this.price = price;
    this.amount = amount;
    this.name = name;
    this.id = id;
    this.percentageAimingTo = percentageAimingTo;
  }

  get totalPrice() {
    return this.price * this.amount;
  }
}
