import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { GetUser, GetUserImpl } from '../../usecases/GetUser';

export interface UserController {
  getUser(req: any, res: any): void;
}

@injectable()
export class UserControllerImpl implements UserController {
  getUserUsecase;
  constructor(@inject(TYPES.GetUser) getUserUsecase: GetUser) {
    this.getUserUsecase = getUserUsecase;
  }

  getUser(req: any, res: any) {
    const user = this.getUserUsecase.get(req.params.id);
    res.code(200).send(user);
  }
}
