import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { RequestHandler } from './handleRequest';
import { Request, Response } from './interfaces';
import { UserController } from './UserController';

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
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.RequestHandler) private requestHandler: RequestHandler
  ) {}

  get listWithoutRequestHandler() {
    return [
      {
        method: 'GET',
        path: '/users/:id',
        handler: this.userController.getUser.bind(this.userController),
        schema: {
          params: {
            type: 'object',
            properties: {
              id: { type: 'string' },
            },
          },
        },
      },
      {
        method: 'POST',
        path: '/users/create',
        handler: this.userController.createUser.bind(this.userController),
        schema: {
          body: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              password: { type: 'string' },
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

  get list() {
    return this.listWithoutRequestHandler.map((route) => ({
      ...route,
      handler: this.requestHandler.handle(route.handler),
    }));
  }
}
