import { BaseController } from '../../ports/http/BaseController';
import { HTTPRoute } from '../../ports/http/interfaces';

export class LoginUserHTTPRoute implements HTTPRoute {
  public constructor(private loginUserController: BaseController) {}

  get route() {
    return {
      method: 'POST',
      path: '/users/login',
      handler: this.loginUserController.execute.bind(this.loginUserController),
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
    };
  }
}
