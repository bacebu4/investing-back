import { Currency } from '../../domain/User';
import { BaseController } from '../../ports/http/BaseController';
import { HTTPRoute, Route } from '../../ports/http/interfaces';

export class CreateUserHTTPRoute implements HTTPRoute {
  public constructor(private createUserController: BaseController) {}

  get route(): Route {
    return {
      method: 'POST',
      url: '/users/create',
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
    };
  }
}
