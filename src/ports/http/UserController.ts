import { inject, injectable } from 'inversify';
import { UserImpl } from '../../domain/User';
import { TYPES } from '../../infrastructure/container/types';
import { RequestPayload } from './handleRequest';
import { CreateUser } from '../../usecases/CreateUser';
import { GetUser } from '../../usecases/GetUser';
import { LoginUser } from '../../usecases/LoginUser';

export interface UserController {
  getUser(requestPayload: RequestPayload): UserImpl;
  createUser(requestPayload: RequestPayload): string;
  loginUser(requestPayload: RequestPayload): string;
}

@injectable()
export class UserControllerImpl implements UserController {
  constructor(
    @inject(TYPES.GetUser) private getUserUsecase: GetUser,
    @inject(TYPES.CreateUser) private createUserUsecase: CreateUser,
    @inject(TYPES.LoginUser) private loginUserUsecase: LoginUser
  ) {}

  getUser({ params }: RequestPayload) {
    const user = this.getUserUsecase.invoke(params.id);
    return user;
  }

  createUser({ body }: RequestPayload) {
    const token = this.createUserUsecase.invoke(body.email, body.password);
    return token;
  }

  loginUser({ body }: RequestPayload) {
    const token = this.loginUserUsecase.invoke(body.email, body.password);
    return token;
  }
}
