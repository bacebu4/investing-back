import { BaseControllerImpl } from '../../ports/http/BaseController';
import { ControllerStatus } from '../../ports/http/interfaces';
import { LoginUserDTO } from './LoginUserDTO';
import { LoginUser } from './LoginUserUsecase';

export class LoginUserControllerImpl extends BaseControllerImpl {
  private useCase: LoginUser;

  constructor(private loginUserFactory: () => LoginUser) {
    super();
  }

  protected async executeImpl({ body: dto }: { body: LoginUserDTO }) {
    this.useCase = this.loginUserFactory();

    const [errors, token] = await this.useCase.invoke(dto);

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
