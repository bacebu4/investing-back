import fastify, { FastifyInstance } from 'fastify';
import { inject, injectable } from 'inversify';
import { Routes } from '../../ports/http/routes';
import { TYPES } from '../container/types';
import { handleRequest } from './handleRequest';

export interface Server {
  server: FastifyInstance;
  start(): void;
}

@injectable()
export class ServerImpl implements Server {
  server: FastifyInstance;

  constructor(@inject(TYPES.Routes) routes: Routes) {
    this.server = fastify({ logger: true });
    routes.list.forEach((route) => {
      route.handler = handleRequest(route.handler);
      this.server.route(route as any);
    });
  }

  start() {
    this.server.listen(3000);
  }
}
