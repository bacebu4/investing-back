import 'reflect-metadata';
import { Container } from 'inversify';
import { GetUser, GetUserImpl } from '../../usecases/GetUser';
import {
  UserRepository,
  UserRepositoryImpl,
} from '../repositories/UserRepository';
import { TYPES } from './types';
import {
  UserController,
  UserControllerImpl,
} from '../../ports/http/UserController';
import { Routes, RoutesImpl } from '../../ports/http/routes';
import { Server, ServerImpl } from '../webserver/fastify';
import { LoginUser, LoginUserImpl } from '../../usecases/LoginUser';
import { CreateUser, CreateUserImpl } from '../../usecases/CreateUser';
import { Auth, AuthImpl } from '../auth/Auth';
import { Logger, LoggerImpl } from '../logger/Logger';

const container = new Container();
container
  .bind<UserRepository>(TYPES.UserRepository)
  .to(UserRepositoryImpl)
  .inSingletonScope();
container.bind<Auth>(TYPES.Auth).to(AuthImpl).inSingletonScope();
container.bind<GetUser>(TYPES.GetUser).to(GetUserImpl).inSingletonScope();
container
  .bind<CreateUser>(TYPES.CreateUser)
  .to(CreateUserImpl)
  .inSingletonScope();
container.bind<LoginUser>(TYPES.LoginUser).to(LoginUserImpl).inSingletonScope();
container
  .bind<UserController>(TYPES.UserController)
  .to(UserControllerImpl)
  .inSingletonScope();
container.bind<Logger>(TYPES.Logger).to(LoggerImpl).inSingletonScope();
container.bind<Routes>(TYPES.Routes).to(RoutesImpl).inSingletonScope();
container.bind<Server>(TYPES.Server).to(ServerImpl).inSingletonScope();

export { container };
