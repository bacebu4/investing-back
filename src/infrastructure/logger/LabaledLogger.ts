import { Logger } from './Logger';
import pino from 'pino';
import { IncomingMessage } from 'http';

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

  public decorateRequestWithTraceId(req: IncomingMessage, cb: Function) {
    this.logger.decorateRequestWithTraceId(req, cb);
  }
}
