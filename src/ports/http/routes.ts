import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { UserController } from './UserController';

export interface Routes {
  list: Array<{ method: string; path: string; handler: any }>;
}

@injectable()
export class RoutesImpl implements Routes {
  public constructor(
    @inject(TYPES.UserController) private userController: UserController
  ) {}

  get list() {
    return [
      {
        method: 'GET',
        path: '/users/:id',
        handler: this.userController.getUser.bind(this.userController),
      },
    ];
  }
}
