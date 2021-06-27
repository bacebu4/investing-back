import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import {
  BaseController,
  ControllerResponse,
  ControllerStatus,
  Request,
} from '../../ports/http/BaseController';
import { CreateUserDTO } from './CreateUserDTO';
import { CreateUser } from './CreateUserUsecase';

@injectable()
export class CreateUserController extends BaseController {
  private useCase: CreateUser;

  constructor(
    @inject(TYPES.FactoryCreateUser)
    private createUserFactory: () => CreateUser
  ) {
    super();
  }

  async executeImpl(req: Request): Promise<ControllerResponse> {
    const dto: CreateUserDTO = req.body as CreateUserDTO;
    this.useCase = this.createUserFactory();

    const [errors, token] = await this.useCase.invoke(dto);

    if (errors?.length) {
      return {
        status: ControllerStatus.clientError,
        data: errors.map((e) => ({ message: this.formatError(e) })),
      };
    } else {
      return {
        status: ControllerStatus.ok,
        data: token,
      };
    }
  }
}
