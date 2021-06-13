import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { GetUser } from '../../usecases/GetUser';

export interface UserController {
  getUser(req: any, res: any): void;
}

@injectable()
export class UserControllerImpl implements UserController {
  constructor(@inject(TYPES.GetUser) private getUserUsecase: GetUser) {}

  getUser(req: any, res: any) {
    const user = this.getUserUsecase.invoke(req.params.id);
    res.code(200).send(user);
  }
}
