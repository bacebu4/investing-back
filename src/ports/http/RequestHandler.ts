import { inject, injectable } from 'inversify';
import { ErrorCode } from '../../domain/Error';
import { TYPES } from '../../infrastructure/container/types';
import { Logger } from '../../infrastructure/logger/Logger';
import { Request, Response } from './interfaces';

export interface RequestPayload {
  body: any;
  params: any;
}
@injectable()
export class RequestHandler implements RequestHandler {
  constructor(@inject(TYPES.Logger) private logger: Logger) {}

  public handle(cb: Function) {
    return async (req: Request, res: Response) => {
      this.logger.decorateRequestWithTraceId(req, async () => {
        await this.executeCb(req, res, cb);
      });
    };
  }

  private async executeCb(req: Request, res: Response, cb: Function) {
    try {
      const payload = this.formPayload(req);
      const result = await cb(payload);
      res.code(200).send(result || {});
    } catch (err) {
      this.handleError(err, res);
    }
  }

  private formPayload(req: Request): RequestPayload {
    return {
      params: req?.params,
      body: req?.body,
    };
  }

  private handleError(err: any, res: Response) {
    this.logger.info(err);

    switch (err?.message) {
      case ErrorCode.UNAUTHENTICATED:
        res.code(401).send(err?.message);
        break;

      case ErrorCode.USER_ALREADY_EXISTS:
        res.code(409).send(err?.message);
        break;

      case ErrorCode.WRONG_PASSWORD_OR_EMAIL:
        res.code(401).send(err?.message);
        break;

      case ErrorCode.CORRUPTED:
        res.code(422).send(err?.message);
        break;

      case ErrorCode.NOT_ESTABLISHED_DB_CONNECTION:
        res.code(503).send(err?.message);
        break;

      default:
        res.code(500).send('An unexpected error occurred');
        break;
    }
  }
}
