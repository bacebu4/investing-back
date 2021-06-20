import { injectable } from 'inversify';
import pino from 'pino';

export interface Logger {
  info(message: string): void;
  child(bindings: pino.Bindings): pino.Logger;
  error(obj: object, msg?: string): void;
}

@injectable()
export class LoggerImpl implements Logger {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino();
    this.logger.child;
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public error(obj: object, msg?: string) {
    this.logger.error(obj, msg);
  }

  public child(bindings: pino.Bindings) {
    return this.logger.child(bindings);
  }
}
