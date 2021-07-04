import { ControllerResponse, ControllerStatus } from './interfaces';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface BaseController {
  execute(req: FastifyRequest, res: FastifyReply): Promise<void>;
}

export abstract class BaseControllerImpl implements BaseController {
  protected abstract executeImpl(
    req: FastifyRequest
  ): Promise<ControllerResponse>;

  public async execute(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      const { status, data } = await this.executeImpl(req);
      this[status](res, data);
    } catch (error) {
      this.fail(res);
    }
  }

  protected formatError(e: Error) {
    return { message: e?.message };
  }

  private [ControllerStatus.ok](res: FastifyReply, data: unknown = {}) {
    return res.code(200).send(data);
  }

  private [ControllerStatus.created](res: FastifyReply, data: unknown = {}) {
    return res.code(201).send(data);
  }

  private [ControllerStatus.clientError](res: FastifyReply, errors: unknown) {
    return res.code(400).send(errors);
  }

  private [ControllerStatus.fail](res: FastifyReply) {
    return res.code(500).send({
      message: 'An unexpected error occurred',
    });
  }

  private [ControllerStatus.unauthorized](res: FastifyReply) {
    return res.code(401).send({ message: 'Unauthorized' });
  }

  private [ControllerStatus.forbidden](res: FastifyReply) {
    return res.code(403).send({ message: 'Forbidden' });
  }

  private [ControllerStatus.notFound](res: FastifyReply) {
    return res.code(404).send({ message: 'Not found' });
  }

  private [ControllerStatus.conflict](res: FastifyReply) {
    return res.code(404).send({ message: 'Conflict' });
  }
}
