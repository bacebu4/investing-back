import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import {
  BaseController,
  ControllerStatus,
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

  async executeImpl({ body: dto }: { body: CreateUserDTO }) {
    this.useCase = this.createUserFactory();

    const [error, token] = await this.useCase.invoke(dto);

    if (error) {
      return {
        status: ControllerStatus.clientError,
        data: error.map((e) => this.formatError(e)),
      };
    }

    return {
      status: ControllerStatus.ok,
      data: token,
    };
  }
}
