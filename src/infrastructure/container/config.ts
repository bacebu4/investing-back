import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { GetUser, GetUserImpl } from '../../usecases/GetUser';
import {
  UserRepository,
  UserRepositoryImpl,
} from '../repositories/UserRepository';
import { TYPES } from './types';

import { Routes, RoutesImpl } from '../../ports/http/Routes';
import { Server, ServerImpl } from '../webserver/fastify';
import { LoginUser, LoginUserImpl } from '../../usecases/LoginUser';
import {
  CreateUser,
  CreateUserImpl,
} from '../../usecases/CreateUser/CreateUserUsecase';
import { TokenService, TokenServiceImpl } from '../token/TokenService';
import { Logger, LoggerImpl } from '../logger/Logger';
import { UUID, UUIDImpl } from '../uuid/UUID';
import { Database, DatabaseImpl } from '../db';
import { CryptoImpl, Crypto } from '../crypto/Crypto';
import { CreateUserControllerImpl } from '../../usecases/CreateUser/CreateUserController';
import { BaseController } from '../../ports/http/BaseController';

const container = new Container();
container.bind<Database>(TYPES.Database).to(DatabaseImpl).inSingletonScope();
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(UserRepositoryImpl)
  .inSingletonScope();
container
  .bind<TokenService>(TYPES.TokenService)
  .to(TokenServiceImpl)
  .inSingletonScope();
container.bind<UUID>(TYPES.UUID).to(UUIDImpl).inSingletonScope();
container.bind<Crypto>(TYPES.Crypto).to(CryptoImpl).inSingletonScope();
container.bind<GetUser>(TYPES.GetUser).to(GetUserImpl).inSingletonScope();
container.bind<CreateUser>(TYPES.CreateUser).to(CreateUserImpl);

container
  .bind<interfaces.Factory<CreateUser>>(TYPES.FactoryCreateUser)
  .toFactory<CreateUser>((context: interfaces.Context) => {
    return () => {
      return context.container.get<CreateUserImpl>(TYPES.CreateUser);
    };
  });

container
  .bind<BaseController>(TYPES.CreateUserController)
  .to(CreateUserControllerImpl)
  .inSingletonScope();

container.bind<LoginUser>(TYPES.LoginUser).to(LoginUserImpl).inSingletonScope();

container.bind<Logger>(TYPES.Logger).to(LoggerImpl).inSingletonScope();

container.bind<Routes>(TYPES.Routes).to(RoutesImpl).inSingletonScope();
container.bind<Server>(TYPES.Server).to(ServerImpl).inSingletonScope();

export { container };
