import { PortfolioImpl } from './src/domain/Portfolio';
import { PortfolioOptimizer } from './src/domain/PortfolioOptimizer';
import { TickerImpl } from './src/domain/Ticker';
import { container } from './src/infrastructure/container/config';
import { TYPES } from './src/infrastructure/container/types';
import { ServerImpl } from './src/infrastructure/webserver/fastify';

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

const portfolio = new PortfolioImpl([ticker1, ticker2, ticker3]);
const portfolioShouldBe = new PortfolioOptimizer(portfolio, 1000);
portfolioShouldBe.optimize();
console.log(portfolio.totalPrice);
console.log(portfolioShouldBe.portfolio.totalPrice);
const server = container.get<ServerImpl>(TYPES.Server);
server.start();

// const getUser = container.get<GetUser>(TYPES.GetUser);
// console.log(getUser.get('123').id);
