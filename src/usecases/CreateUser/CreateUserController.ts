import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { BaseControllerImpl } from '../../ports/http/BaseController';
import {
  ControllerResponse,
  ControllerStatus,
} from '../../ports/http/interfaces';
import { CreateUserDTO } from './CreateUserDTO';
import { CreateUser } from './CreateUserUsecase';

@injectable()
export class CreateUserControllerImpl extends BaseControllerImpl {
  private useCase: CreateUser;

  constructor(
    @inject(TYPES.FactoryCreateUser)
    private createUserFactory: () => CreateUser
  ) {
    super();
  }

  protected async executeImpl({
    body: dto,
  }: {
    body: CreateUserDTO;
  }): Promise<ControllerResponse> {
    this.useCase = this.createUserFactory();

    const [error, token] = await this.useCase.invoke(dto);

    if (error) {
      return {
        status: ControllerStatus.clientError,
        data: error.map((e) => this.formatError(e)),
      };
    }

    return {
      status: ControllerStatus.created,
      data: token,
    };
  }
}
