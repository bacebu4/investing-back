import { inject, injectable } from 'inversify';
import { TYPES } from '../../infrastructure/container/types';
import {
  BaseController,
  Request,
  Response,
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

  async executeImpl(req: Request, res: Response): Promise<any> {
    const dto: CreateUserDTO = req.body as CreateUserDTO;
    this.useCase = this.createUserFactory();

    try {
      const [errors, token] = await this.useCase.invoke(dto);

      if (errors?.length) {
        const prettyErrors = errors.map((e) => ({ message: e?.message }));
        return this.clientError(res, prettyErrors);
      } else {
        return this.ok(res, token);
      }
    } catch (err) {
      console.log(err);

      return this.fail(res, err);
    }
  }
}
