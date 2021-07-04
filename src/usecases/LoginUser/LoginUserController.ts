import { BaseControllerImpl } from '../../ports/http/BaseController';
import { ControllerStatus } from '../../ports/http/interfaces';
import { LoginUser } from './LoginUserUsecase';

export class LoginUserControllerImpl extends BaseControllerImpl {
  constructor(private loginUserFactory: () => LoginUser) {
    super();
  }

  protected async executeImpl({ body: dto }) {
    const useCase = this.loginUserFactory();

    const [errors, token] = await useCase.invoke(dto);

    if (errors) {
      return {
        status: ControllerStatus.clientError,
        data: errors.map(this.formatError),
      };
    }

    return {
      status: ControllerStatus.ok,
      data: token.value,
    };
  }
}
