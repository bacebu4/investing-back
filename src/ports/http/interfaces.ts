import { FastifyReply, FastifyRequest } from 'fastify';

export enum ControllerStatus {
  clientError = 'clientError',
  ok = 'ok',
  fail = 'fail',
  created = 'created',
  unauthorized = 'unauthorized',
  forbidden = 'forbidden',
  notFound = 'notFound',
  conflict = 'conflict',
}

export interface ControllerResponse {
  status: ControllerStatus;
  data: any;
}

export interface HTTPRoute {
  route: {
    method: string;
    path: string;
    handler: (req: FastifyRequest, res: FastifyReply) => void;
  };
}
