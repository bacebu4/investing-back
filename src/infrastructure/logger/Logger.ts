// const { AsyncLocalStorage } = require('async_hooks');
// const asyncLocalStorage = new AsyncLocalStorage();
import { injectable } from 'inversify';
import pino from 'pino';

export interface Logger {
  info(message: string): void;
}

@injectable()
export class LoggerImpl implements Logger {
  private logger;

  constructor() {
    this.logger = pino({ prettyPrint: true });
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public child(traceId: string) {
    return this.logger.child({ traceId });
  }
}

// inject the dependency
// export class RequestLoggerProxy {
//   decorate(cb: Function) {
//     const traceId = Date.now().toString();
//     const store = asyncLocalStorage.getStore();
//     const childLogger = this.child(traceId);
//     store.set('logger', childLogger);

//     asyncLocalStorage.run(new Map(), async () => {
//       await cb();
//     });
//   }

//   get() {
//     const store = asyncLocalStorage.getStore();
//     const childLogger = store?.get('logger');
//     return childLogger ? childLogger : logger;
//   }
// }
