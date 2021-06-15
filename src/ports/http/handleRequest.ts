import { ErrorCode } from '../../domain/Error';
import { Request, Response } from './interfaces';

export function handleRequest(cb: Function) {
  return async (req: Request, res: Response) => {
    const payload = formPayload(req);
    try {
      const result = await cb(payload);
      res.code(200).send(result || {});
    } catch (err) {
      handleError(err, res);
    }
  };
}
export interface RequestPayload {
  body: any;
  params: any;
}

function formPayload(req: Request): RequestPayload {
  return {
    params: req?.params,
    body: req?.body,
  };
}

function handleError(err: any, res: Response) {
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

    default:
      res.code(500).send('An unexpected error occurred');
      break;
  }
}
