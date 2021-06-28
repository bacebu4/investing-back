import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import { fold } from '../../lib/Either';
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

    const res = await this.useCase.invoke(dto);

    return fold(
      res,
      (e) => {
        return {
          status: ControllerStatus.clientError,
          data: e.map((e) => this.formatError(e)),
        };
      },
      (token) => {
        return {
          status: ControllerStatus.ok,
          data: token,
        };
      }
    );
  }
}
