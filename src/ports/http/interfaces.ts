import { FastifyReply, FastifyRequest, HTTPMethods } from 'fastify';

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
  data: unknown;
}

export type Route = {
  method: HTTPMethods;
  url: string;
  handler: (req: FastifyRequest, res: FastifyReply) => void;
  schema: unknown;
};

export interface HTTPRoute {
  route: Route;
}
