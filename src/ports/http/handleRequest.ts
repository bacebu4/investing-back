import { Request, Response } from './interfaces';

export interface RequestPayload {
  body: any;
  params: any;
}

function defParams(req: Request): RequestPayload {
  return {
    params: req?.params,
    body: req?.body,
  };
}

export function handleRequest(cb: Function) {
  return async (req: Request, res: Response) => {
    const params = defParams(req);
    try {
      const result = await cb(params);

      res.code(200).send(result || {});
    } catch (err) {
      // TODO handle auth error here
      res.code(500).send('An unexpected error occurred');
    }
  };
}
