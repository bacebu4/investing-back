import { BaseControllerImpl } from '../../ports/http/BaseController';
import {
  ControllerResponse,
  ControllerStatus,
} from '../../ports/http/interfaces';
import { CreateUserDTO } from './CreateUserDTO';
import { CreateUser } from './CreateUserUsecase';

export class CreateUserControllerImpl extends BaseControllerImpl {
  private useCase: CreateUser;

  constructor(private createUserFactory: () => CreateUser) {
    super();
  }

  protected async executeImpl({
    body: dto,
  }: {
    body: CreateUserDTO;
  }): Promise<ControllerResponse> {
    this.useCase = this.createUserFactory();

    const [errors, token] = await this.useCase.invoke(dto);

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
