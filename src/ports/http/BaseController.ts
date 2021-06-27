import { injectable } from 'inversify';

export interface Request {
  body: any;
  params: any;
  headers: any;
}

export interface Response {
  code(codeNumber: number): Response;
  send(payload: any): void;
}

export enum ControllerStatus {
  clientError = 'clientError',
  ok = 'ok',
  failed = 'failed',
}
export interface ControllerResponse {
  status: ControllerStatus;
  data: any;
}

@injectable()
export class BaseController {
  protected executeImpl(req: Request): Promise<ControllerResponse> {
    throw new Error('`executeImpl` is not implemented');
  }

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

  private ok(res: Response, data: any = {}) {
    return res.code(200).send(data);
  }

  private created(res: Response) {
    return res.code(201).send({});
  }

  private clientError(res: Response, errors: any) {
    return res.code(400).send(errors);
  }

  private fail(res: Response, error: any) {
    return res.code(500).send({
      message: 'An unexpected error occurred',
    });
  }

  private unauthorized(res: Response) {
    return res.code(401).send({ message: 'Unauthorized' });
  }

  private forbidden(res: Response) {
    return res.code(403).send({ message: 'Forbidden' });
  }

  private notFound(res: Response) {
    return res.code(404).send({ message: 'Not found' });
  }

  private conflict(res: Response) {
    return res.code(404).send({ message: 'Conflict' });
  }
}
