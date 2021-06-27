import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { Request, Response } from './interfaces';
import { Currency } from '../../domain/User';
import { CreateUserController } from '../../usecases/CreateUser/CreateUserController';

export interface Routes {
  list: Array<{
    method: string;
    path: string;
    handler: (req: Request, res: Response) => void;
  }>;
}

@injectable()
export class RoutesImpl implements Routes {
  public constructor(
    @inject(TYPES.CreateUserController)
    private createUserController: CreateUserController
  ) {}

  get list() {
    return [
      // {
      //   method: 'GET',
      //   path: '/users/:id',
      //   handler: this.userController.getUser.bind(this.userController),
      //   schema: {
      //     params: {
      //       type: 'object',
      //       properties: {
      //         id: { type: 'string' },
      //       },
      //     },
      //   },
      // },
      {
        method: 'POST',
        path: '/users/create',
        handler: this.createUserController.execute.bind(
          this.createUserController
        ),
        schema: {
          body: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              password: { type: 'string' },
              currency: { type: 'string', enum: Object.values(Currency) },
            },
          },
          response: {
            200: {
              type: 'string',
            },
          },
        },
      },
    ];
  }
}
