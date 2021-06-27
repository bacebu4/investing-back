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

@injectable()
export class BaseController {
  protected executeImpl(req: Request, res: Response): Promise<void | any> {
    throw new Error('not here');
  }

  public execute(req: Request, res: Response): void {
    this.executeImpl(req, res);
  }

  protected ok<T>(res: Response, dto?: T) {
    return res.code(200).send(dto);
  }

  protected created(res: Response) {
    return res.code(201).send({});
  }

  protected clientError(res: Response, errors: any) {
    return res.code(400).send(errors);
  }

  protected unauthorized(res: Response, message = 'Unauthorized') {
    return res.code(401).send(message);
  }

  protected forbidden(res: Response, message = 'Forbidden') {
    return res.code(403).send(message);
  }

  protected notFound(res: Response, message = 'Not found') {
    return res.code(404).send(message);
  }

  protected conflict(res: Response, message = 'Conflict') {
    return res.code(404).send(message);
  }

  protected fail(res: Response, error: any) {
    return res.code(500).send({
      message: 'An unexpected error occurred',
    });
  }
}
