import { inject, injectable } from 'inversify';
import { User } from '../../domain/User';
import { TYPES } from '../../infrastructure/container/types';
import { RequestHandler, RequestPayload } from './RequestHandler';
import { CreateUser } from '../../usecases/CreateUser';
import { GetUser } from '../../usecases/GetUser';
import { LoginUser } from '../../usecases/LoginUser';
import { Logger } from '../../infrastructure/logger/Logger';

export interface UserController {
  getUser(requestPayload: RequestPayload): User;
  createUser(requestPayload: RequestPayload): Promise<string>;
  loginUser(requestPayload: RequestPayload): Promise<string>;
}

@injectable()
export class UserControllerImpl implements UserController {
  constructor(
    @inject(TYPES.GetUser) private getUserUsecase: GetUser,
    @inject(TYPES.CreateUser) private createUserUsecase: CreateUser,
    @inject(TYPES.LoginUser) private loginUserUsecase: LoginUser,
    @inject(TYPES.RequestLogger) private logger: Logger
  ) {}

  getUser({ params }: RequestPayload) {
    this.logger.info('started');
    const user = this.getUserUsecase.invoke(params.id);
    return user;
  }

  createUser({ body }: RequestPayload) {
    const token = this.createUserUsecase.invoke({
      email: body.email,
      password: body.password,
      currency: 'RUB' as any,
    });
    return token;
  }

  loginUser({ body }: RequestPayload) {
    const token = this.loginUserUsecase.invoke({
      email: body.email,
      password: body.password,
    });
    return token;
  }
}
