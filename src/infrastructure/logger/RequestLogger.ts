import { inject, injectable } from 'inversify';
import { Request } from '../../ports/http/interfaces';
import { TYPES } from '../container/types';
import { Logger } from './Logger';
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestLogger {
  info(message: string): void;
  decorate(req: Request, cb: Function): void;
}

const LOGGER_KEY = 'logger';

@injectable()
export class RequestLoggerImpl implements RequestLogger {
  private asyncLocalStorage: AsyncLocalStorage<any>;

  constructor(@inject(TYPES.Logger) private logger: Logger) {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  public info(message: string) {
    const childLogger = this.asyncLocalStorage.getStore()?.get(LOGGER_KEY);
    const newLogger = childLogger ? childLogger : this.logger;
    newLogger.info(message);
  }

  public decorate(req: Request, cb: Function) {
    this.asyncLocalStorage.run(new Map(), async () => {
      const traceId = req.headers['x-request-id'] || Date.now().toString();

      const childLogger = this.logger.child({
        traceId,
      });

      this.asyncLocalStorage.getStore().set(LOGGER_KEY, childLogger);
      await cb();
    });
  }
}
