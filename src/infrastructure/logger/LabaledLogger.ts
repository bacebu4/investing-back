import { Request } from '../../ports/http/interfaces';
import { Logger } from './Logger';
import pino from 'pino';

export class LabeledLogger implements Logger {
  constructor(private logger: Logger, private name: string) {}

  public info(message: string) {
    this.logger.info(this.decorateMessageWithName(message));
  }

  public error(obj: object, msg?: string) {
    this.logger.error(obj, this.decorateMessageWithName(msg));
  }

  private decorateMessageWithName(message?: string) {
    if (message) {
      return `[${this.name}]: ${message}`;
    }
  }

  public child(bindings: pino.Bindings) {
    return this.logger.child(bindings);
  }

  public decorateRequestWithTraceId(req: Request, cb: Function) {
    this.logger.decorateRequestWithTraceId(req, cb);
  }
}
