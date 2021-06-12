interface Ticker {
  price: number;
  amount: number;
  name: string;
  id: string;
  percentageAimingTo: number;
  totalPrice: number;
}

interface TickerShouldBe extends Ticker {
  totalPriceShouldBe: number;
  fractionalAmountToBuy: number;
}

export class TickerImpl implements Ticker {
  price;
  amount;
  name;
  id;
  percentageAimingTo;

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

interface Portfolio {
  tickers: Ticker[];
  totalPrice: number;
  amountOfTickers: number;
  percentageOfEveryTicker: Array<Ticker & { percentage: number }>;
  allPercentages: Array<
    Ticker & { percentage: number; relativePercentage: number }
  >;
  allTotalPriceAimingTo: Array<Ticker & { totalPriceAimingTo: number }>;
  percentageOfTickerById(id: string): number;
  relativePercentageOfTickerById(id: string): number;
}

export class PortfolioImpl implements Portfolio {
  public tickers;

  constructor(tickers: Ticker[]) {
    this.tickers = tickers;
  }

  get totalPrice() {
    return this.tickers.reduce((acc, val) => acc + val.totalPrice, 0);
  }

  get percentageOfEveryTicker() {
    return this.tickers.map((ticker) => ({
      ...ticker,
      percentage: ticker.totalPrice / this.totalPrice,
    }));
  }

  percentageOfTickerById(id: string) {
    const ticker = this.tickers.find(({ id: tickerId }) => tickerId === id);

    return ticker!.totalPrice / this.totalPrice;
  }

  get allPercentages() {
    const tickersWithPercentage = this.percentageOfEveryTicker;
    return tickersWithPercentage.map((ticker) => ({
      ...ticker,
      relativePercentage:
        (ticker.percentageAimingTo - ticker.percentage) /
        ticker.percentageAimingTo,
    }));
  }

  relativePercentageOfTickerById(id: string) {
    const ticker = this.tickers.find(({ id: tickerId }) => tickerId === id);

    return (
      (ticker!.percentageAimingTo - this.percentageOfTickerById(id)) /
      ticker!.percentageAimingTo
    );
  }

  get allTotalPriceAimingTo() {
    return this.tickers.map((ticker) => ({
      ...ticker,
      totalPriceAimingTo: this.totalPrice * ticker.percentageAimingTo,
    }));
  }

  get amountOfTickers() {
    return this.tickers.length;
  }
}

export class PortfolioImplWithInvestingSum extends PortfolioImpl {
  amountToInvest;
  tickersShouldBe: TickerShouldBe[];

  constructor(portfolio: Portfolio, amountToInvest: number) {
    super(portfolio.tickers);
    this.amountToInvest = amountToInvest;

    this.tickersShouldBe = this.tickers.map((ticker) => {
      return {
        ...ticker,
        totalPriceShouldBe: this.totalPrice * ticker.percentageAimingTo,
        fractionalAmountToBuy:
          (this.totalPrice * ticker.percentageAimingTo - ticker.totalPrice) /
          ticker.price,
      };
    });
  }

  get totalPrice() {
    return this.tickers.reduce(
      (acc, val) => acc + val.totalPrice,
      this.amountToInvest
    );
  }
}

const ticker1 = new TickerImpl({
  price: 10,
  amount: 2,
  name: 'first',
  id: '1',
  percentageAimingTo: 0.2,
});

const ticker2 = new TickerImpl({
  price: 10,
  amount: 2,
  name: 'second',
  id: '2',
  percentageAimingTo: 0.3,
});

const ticker3 = new TickerImpl({
  price: 10,
  amount: 2,
  name: 'third',
  id: '3',
  percentageAimingTo: 0.5,
});

function calculateFractionalAmountsOfTickersToBuy(
  portfolio: Portfolio,
  amountToInvest: number
) {
  for (let i = 0; i < portfolio.amountOfTickers; ++i) {}
}

const portfolio = new PortfolioImpl([ticker1, ticker2, ticker3]);
const portfolioShouldBe = new PortfolioImplWithInvestingSum(portfolio, 1000);
console.log(portfolioShouldBe.tickersShouldBe);
