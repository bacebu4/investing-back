import { Portfolio } from './src/domain/Portfolio';
import { PortfolioOptimizer } from './src/domain/PortfolioOptimizer';
import { TickerWithPrice } from './src/domain/TickerWithPrice';
import { CryptoImpl } from './src/infrastructure/crypto/Crypto';
import { DatabaseImpl } from './src/infrastructure/db';
import { LabeledLogger } from './src/infrastructure/logger/LabaledLogger';
import { LoggerImpl } from './src/infrastructure/logger/Logger';
import { UserRepositoryImpl } from './src/infrastructure/repositories/user/UserRepository';
import {
  Token,
  TokenServiceImpl,
} from './src/infrastructure/token/TokenService';
import { UUIDImpl } from './src/infrastructure/uuid/UUID';
import { ServerImpl } from './src/ports/http/fastify';
import { CreateUserControllerImpl } from './src/usecases/CreateUser/CreateUserController';
import { CreateUserHTTPRoute } from './src/usecases/CreateUser/CreateUserHTTPRoute';
import { LoginUserHTTPRoute } from './src/usecases/LoginUser/LoginUserHTTPRoute';
import { CreateUserImpl } from './src/usecases/CreateUser/CreateUserUsecase';
import { LoginUserControllerImpl } from './src/usecases/LoginUser/LoginUserController';
import { LoginUserImpl } from './src/usecases/LoginUser/LoginUserUsecase';
import { AddNewTickerImpl } from './src/usecases/AddNewTicker/AddNewTickerUsecase';
import { SymbolRepositoryImpl } from './src/infrastructure/repositories/symbol/SymbolRepository';

// TODO server factory
async function bootstrap() {
  const ticker1 = new TickerWithPrice({
    price: 10,
    amount: 2,
    symbol: {
      value: 'CHMF',
      name: 'Sever',
    },
    id: '1',
    percentageAimingTo: 0.2,
  });

  const ticker2 = new TickerWithPrice({
    price: 10,
    amount: 2,
    symbol: {
      value: 'CHMF',
      name: 'Sever',
    },
    id: '2',
    percentageAimingTo: 0.3,
  });

  const ticker3 = new TickerWithPrice({
    price: 10,
    amount: 2,
    symbol: {
      value: 'CHMF',
      name: 'Sever',
    },
    id: '3',
    percentageAimingTo: 0.5,
  });

  const [portfolioError, portfolio] = Portfolio.from([
    ticker1,
    ticker2,
    ticker3,
  ]);

  if (portfolioError) {
    throw new Error('error creating portfolio');
  }

  const portfolioShouldBe = new PortfolioOptimizer(portfolio, 1000);
  portfolioShouldBe.optimize();
  console.log(portfolio.totalPrice);
  console.log(portfolioShouldBe.portfolio.totalPrice);

  const logger = new LoggerImpl();

  const dbLogger = new LabeledLogger(logger, 'db');
  const db = await DatabaseImpl.create(dbLogger);

  const userRepo = new UserRepositoryImpl(logger, db);
  const symbolRepo = new SymbolRepositoryImpl(logger, db);
  const uuid = new UUIDImpl();
  const crypto = new CryptoImpl();
  const tokenService = new TokenServiceImpl();

  const createUserFactory = () =>
    new CreateUserImpl(userRepo, uuid, crypto, tokenService);

  const loginUserUsecaseLogger = new LabeledLogger(logger, 'LoginUser Usecase');
  const loginUserFactory = () =>
    new LoginUserImpl(userRepo, crypto, tokenService, loginUserUsecaseLogger);

  const createUserController = new CreateUserControllerImpl(createUserFactory);
  const loginUserController = new LoginUserControllerImpl(loginUserFactory);

  const createUserRoute = new CreateUserHTTPRoute(createUserController);
  const loginUserRoute = new LoginUserHTTPRoute(loginUserController);
  const server = new ServerImpl([createUserRoute, loginUserRoute]);

  const a = new AddNewTickerImpl(uuid, tokenService, userRepo, symbolRepo);
  const res = await a.invoke(
    { symbol: 'SOME3', initialAmount: 1, percentageAimingTo: 0.3 },
    new Token(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjODYxMWU1ZC0yZDNmLTRlZTItODE0Yi0yODUwZWUyNDczMGYiLCJpYXQiOjE2MjU5NDM4NTh9.Ch4YfHyznmSAPLAxf0muYM3UjfeVNfSBNM4u4dihT78'
    )
  );
  console.log(res);

  server.start();
}
try {
  bootstrap();
} catch (error) {
  console.log(error);
}
