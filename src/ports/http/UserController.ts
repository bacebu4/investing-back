import { inject, injectable } from 'inversify';
import { container } from '../../infrastructure/container/config';
import { TYPES } from '../../infrastructure/container/types';
import { GetUser, GetUserImpl } from '../../usecases/GetUser';

export interface UserController {
  getUser(req: any, res: any): void;
}

@injectable()
export class UserControllerImpl implements UserController {
  getUserUsecase;
  constructor(@inject('GetUser') getUserUsecase: GetUser) {
    // console.log(getUserUsecase);
    this.getUserUsecase = getUserUsecase;
  }

  getUser(req: any, res: any) {
    // const getUser = container.get<GetUserImpl>(TYPES.GetUser);
    // const user = getUser.get(req.params.id);
    console.log(this.getUserUsecase);
    const user = this.getUserUsecase.get(req.params.id);
    res.code(200).send(user);
  }
}
