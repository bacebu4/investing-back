import { BaseControllerImpl } from '../../ports/http/BaseController';
import { ControllerStatus } from '../../ports/http/interfaces';
import { CreateUser } from './CreateUserUsecase';

export class CreateUserControllerImpl extends BaseControllerImpl {
  constructor(private createUserFactory: () => CreateUser) {
    super();
  }

  protected async executeImpl({ body: dto }) {
    const useCase = this.createUserFactory();

    const [errors, token] = await useCase.invoke(dto);

    if (errors) {
      return {
        status: ControllerStatus.clientError,
        data: errors.map(this.formatError),
      };
    }

    return {
      status: ControllerStatus.created,
      data: token.value,
    };
  }
}
