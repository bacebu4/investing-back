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

const container = new Container();
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
container.bind<GetUser>(TYPES.GetUser).to(GetUserImpl);
container.bind<CreateUser>(TYPES.CreateUser).to(CreateUserImpl);
container.bind<LoginUser>(TYPES.LoginUser).to(LoginUserImpl);
container.bind<UserController>(TYPES.UserController).to(UserControllerImpl);
container.bind<Routes>(TYPES.Routes).to(RoutesImpl);
container.bind<Server>(TYPES.Server).to(ServerImpl);

export { container };
