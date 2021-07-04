import fastify, { FastifyInstance } from 'fastify';
import { HTTPRoute } from './interfaces';

export interface Server {
  server: FastifyInstance;
  start(): void;
}

export class ServerImpl implements Server {
  server: FastifyInstance;

  constructor(routes: HTTPRoute[]) {
    this.server = fastify({ logger: true });
    routes.forEach(({ route }) => {
      this.server.route(route);
    });
  }

  start() {
    this.server.listen(3000);
  }
}
