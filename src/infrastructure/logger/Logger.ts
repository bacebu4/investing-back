import { injectable } from 'inversify';
import pino from 'pino';

export interface Logger {
  info(message: string): void;
  child(bindings: pino.Bindings): pino.Logger;
}

@injectable()
export class LoggerImpl implements Logger {
  private logger;

  constructor() {
    this.logger = pino({ prettyPrint: true });
    this.logger.child;
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public child(bindings: pino.Bindings) {
    return this.logger.child(bindings);
  }
}
