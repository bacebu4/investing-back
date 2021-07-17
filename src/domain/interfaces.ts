export interface TickerSymbol {
  value: string;
  name: string;
}

export interface Ticker {
  amount: number;
  symbol: TickerSymbol;
  id: string;
  percentageAimingTo: number;
}
