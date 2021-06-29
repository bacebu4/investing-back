import {
  ControllerResponse,
  ControllerStatus,
  Response,
  Request,
} from './interfaces';

export interface BaseController {
  execute(req: Request, res: Response): Promise<void>;
}

export abstract class BaseControllerImpl implements BaseController {
  protected abstract executeImpl(req: Request): Promise<ControllerResponse>;

  public async execute(req: Request, res: Response): Promise<void> {
    try {
      const { status, data } = await this.executeImpl(req);
      this[status](res, data);
    } catch (error) {
      this.fail(res, error);
    }
  }

  protected formatError(e: any) {
    return { message: e?.message };
  }

  private [ControllerStatus.ok](res: Response, data: any = {}) {
    return res.code(200).send(data);
  }

  private [ControllerStatus.created](res: Response, data: any = {}) {
    return res.code(201).send(data);
  }

  private [ControllerStatus.clientError](res: Response, errors: any) {
    return res.code(400).send(errors);
  }

  private [ControllerStatus.fail](res: Response, error: any) {
    return res.code(500).send({
      message: 'An unexpected error occurred',
    });
  }

  private [ControllerStatus.unauthorized](res: Response) {
    return res.code(401).send({ message: 'Unauthorized' });
  }

  private [ControllerStatus.forbidden](res: Response) {
    return res.code(403).send({ message: 'Forbidden' });
  }

  private [ControllerStatus.notFound](res: Response) {
    return res.code(404).send({ message: 'Not found' });
  }

  private [ControllerStatus.conflict](res: Response) {
    return res.code(404).send({ message: 'Conflict' });
  }
}
