import pino from 'pino';
import { AsyncLocalStorage } from 'async_hooks';
import { Request } from '../../ports/http/interfaces';

export interface Logger {
  info(message: string): void;
  child(bindings: pino.Bindings): pino.Logger;
  error(obj: object, msg?: string): void;
  decorateRequestWithTraceId(req: Request, cb: Function): void;
}

const LOGGER_KEY = 'logger';

export class LoggerImpl implements Logger {
  protected logger: pino.Logger;
  private asyncLocalStorage: AsyncLocalStorage<
    Map<string, Logger | pino.Logger>
  >;

  constructor() {
    this.logger = pino({ prettyPrint: true });
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  get loggerWithTraceIdIfPossible() {
    const childLoggerFromStorage = this.asyncLocalStorage
      .getStore()
      ?.get(LOGGER_KEY);
    const newLogger = childLoggerFromStorage
      ? childLoggerFromStorage
      : this.logger;
    return newLogger;
  }

  public info(message: string) {
    this.loggerWithTraceIdIfPossible.info(message);
  }

  public error(obj: object, msg?: string) {
    this.loggerWithTraceIdIfPossible.error(obj, msg);
  }

  public child(bindings: pino.Bindings) {
    return this.loggerWithTraceIdIfPossible.child(bindings);
  }

  public decorateRequestWithTraceId(req: Request, cb: Function) {
    this.asyncLocalStorage.run(new Map(), async () => {
      const traceId = req.headers['x-request-id'] || Date.now().toString();
      const childLogger = this.logger.child({
        traceId,
      });

      this.asyncLocalStorage.getStore()?.set(LOGGER_KEY, childLogger);

      await cb();
    });
  }
}
