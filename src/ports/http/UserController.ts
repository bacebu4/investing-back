import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { GetUser } from '../../usecases/GetUser';
import { Request, Response } from './interfaces';

export interface UserController {
  getUser(req: Request, res: Response): void;
}

@injectable()
export class UserControllerImpl implements UserController {
  constructor(@inject(TYPES.GetUser) private getUserUsecase: GetUser) {}

  getUser(req: Request, res: Response) {
    const user = this.getUserUsecase.invoke(req.params.id);
    res.code(200).send(user);
  }
}
