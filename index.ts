import { Portfolio } from './src/domain/Portfolio';
import { PortfolioOptimizer } from './src/domain/PortfolioOptimizer';
import { Ticker } from './src/domain/Ticker';
import { CryptoImpl } from './src/infrastructure/crypto/Crypto';
import { DatabaseImpl } from './src/infrastructure/db';
import { LoggerImpl } from './src/infrastructure/logger/Logger';
import { UserRepositoryImpl } from './src/infrastructure/repositories/UserRepository';
import { TokenServiceImpl } from './src/infrastructure/token/TokenService';
import { UUIDImpl } from './src/infrastructure/uuid/UUID';
import { ServerImpl } from './src/infrastructure/webserver/fastify';
import { RoutesImpl } from './src/ports/http/Routes';
import { CreateUserControllerImpl } from './src/usecases/CreateUser/CreateUserController';
import { CreateUserImpl } from './src/usecases/CreateUser/CreateUserUsecase';

const ticker1 = new Ticker({
  price: 10,
  amount: 2,
  name: 'first',
  id: '1',
  percentageAimingTo: 0.2,
});

const ticker2 = new Ticker({
  price: 10,
  amount: 2,
  name: 'second',
  id: '2',
  percentageAimingTo: 0.3,
});

const ticker3 = new Ticker({
  price: 10,
  amount: 2,
  name: 'third',
  id: '3',
  percentageAimingTo: 0.5,
});

const portfolio = new Portfolio([ticker1, ticker2, ticker3]);
const portfolioShouldBe = new PortfolioOptimizer(portfolio, 1000);
portfolioShouldBe.optimize();
console.log(portfolio.totalPrice);
console.log(portfolioShouldBe.portfolio.totalPrice);

const logger = new LoggerImpl();
const db = new DatabaseImpl();

const userRepo = new UserRepositoryImpl(logger, db);
const uuid = new UUIDImpl();
const crypto = new CryptoImpl();
const tokenService = new TokenServiceImpl();

const createUserFactory = () =>
  new CreateUserImpl(userRepo, uuid, crypto, tokenService);

const createUserController = new CreateUserControllerImpl(createUserFactory);
const routes = new RoutesImpl(createUserController);
const server = new ServerImpl(routes);

server.start();
db.initialize();
