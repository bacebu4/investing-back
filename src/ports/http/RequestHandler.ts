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
    if (err?.length) {
      const errors = err.map((e) => ({ message: e?.message }));
      res.code(400).send(errors);
    } else {
      res.code(400).send(err?.message || 'An unexpected error occurred');
    }
  }
}
