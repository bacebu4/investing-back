import fastify, { FastifyInstance } from 'fastify';
import { BaseController } from './BaseController';
import { Routes, RoutesImpl } from './Routes';

export interface Server {
  server: FastifyInstance;
  start(): void;
}

export class ServerImpl implements Server {
  server: FastifyInstance;

  constructor(
    private createUserController: BaseController,
    private loginUserController: BaseController
  ) {
    const routes = new RoutesImpl(createUserController, loginUserController);
    this.server = fastify({ logger: true });
    routes.list.forEach((route) => {
      this.server.route(route as any);
    });
  }

  start() {
    this.server.listen(3000);
  }
}
