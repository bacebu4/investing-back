import fastify, { FastifyInstance } from 'fastify';
import { Routes } from '../../ports/http/Routes';

export interface Server {
  server: FastifyInstance;
  start(): void;
}

export class ServerImpl implements Server {
  server: FastifyInstance;

  constructor(routes: Routes) {
    this.server = fastify({ logger: true });
    routes.list.forEach((route) => {
      this.server.route(route as any);
    });
  }

  start() {
    this.server.listen(3000);
  }
}
