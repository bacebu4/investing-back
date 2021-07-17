import pino from 'pino';
import { AsyncLocalStorage } from 'async_hooks';
import { IncomingMessage } from 'http';

export interface Logger {
  info(message: string): void;
  child(bindings: pino.Bindings): pino.Logger;
  // eslint-disable-next-line @typescript-eslint/ban-types
  error(obj: object, msg?: string): void;
  decorateRequestWithTraceId(req: IncomingMessage, cb: () => void): void;
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

  public error(obj: Record<string, unknown>, msg?: string) {
    this.loggerWithTraceIdIfPossible.error(obj, msg);
  }

  public child(bindings: pino.Bindings) {
    return this.loggerWithTraceIdIfPossible.child(bindings);
  }

  public decorateRequestWithTraceId(req: IncomingMessage, cb: () => void) {
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
