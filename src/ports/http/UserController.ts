import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { CreateUser } from '../../usecases/CreateUser';
import { GetUser } from '../../usecases/GetUser';
import { LoginUser } from '../../usecases/LoginUser';
import { Request, Response } from './interfaces';

export interface UserController {
  getUser(req: Request, res: Response): void;
  createUser(req: Request, res: Response): void;
  loginUser(req: Request, res: Response): void;
}

@injectable()
export class UserControllerImpl implements UserController {
  constructor(
    @inject(TYPES.GetUser) private getUserUsecase: GetUser,
    @inject(TYPES.CreateUser) private createUserUsecase: CreateUser,
    @inject(TYPES.LoginUser) private loginUserUsecase: LoginUser
  ) {}

  getUser(req: Request, res: Response) {
    const user = this.getUserUsecase.invoke(req.params.id);
    res.code(200).send(user);
  }

  createUser(req: Request, res: Response) {
    const token = this.createUserUsecase.invoke(
      req.body.email,
      req.body.password
    );
    res.code(200).send(token);
  }

  loginUser(req: Request, res: Response) {
    const token = this.loginUserUsecase.invoke(
      req.body.email,
      req.body.password
    );
    res.code(200).send(token);
  }
}
