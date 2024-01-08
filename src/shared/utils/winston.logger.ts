import { ConsoleLogger, Logger as NestLogger } from '@nestjs/common';
import 'dotenv/config';
import {
  LoggerOptions,
  Logger as WinstonLogger,
  createLogger as createWinstonLogger,
  format,
  transports,
} from 'winston';

export const WinstonLoggerConfig = {
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
};

export const createLogger = (options: LoggerOptions): WinstonLogger =>
  createWinstonLogger(options);

const defaultLogger = createLogger(WinstonLoggerConfig);
const useWinston = process.env.ENABLE_WINSTON_LOGGER === 'true';

export class Logger extends ConsoleLogger {
  private readonly logger: WinstonLogger = defaultLogger;

  log(message: string, context?: string): void {
    if (useWinston) {
      this.logger.info(message, { context });
    } else {
      super.log(message, context);
    }
  }

  error(message: string, trace?: string, context?: string): void {
    if (useWinston) {
      this.logger.error(message, { trace, context });
    } else {
      super.error(message, trace, context);
    }
  }

  warn(message: string, context?: string): void {
    if (useWinston) {
      this.logger.warn(message, { context });
    } else {
      super.warn(message, context);
    }
  }

  debug(message: string, context?: string): void {
    if (useWinston) {
      this.logger.debug(message, { context });
    } else {
      super.debug(message, context);
    }
  }

  verbose(message: string, context?: string): void {
    if (useWinston) {
      this.logger.verbose(message, { context });
    } else {
      super.verbose(message, context);
    }
  }

  static log(message: string, context?: string): void {
    if (useWinston) {
      defaultLogger.info(message, { context });
    } else {
      NestLogger.log(message, context);
    }
  }

  static error(message: string | any, trace?: string, context?: string): void {
    const errorMessage: string =
      typeof message === 'string' ? message : message?.message;
    const meta: any = typeof message === 'object' ? message : {};
    if (useWinston) {
      defaultLogger.error(errorMessage, { ...meta, context, trace });
    } else {
      NestLogger.error(errorMessage, trace, context);
    }
  }

  static warn(message: string, context?: string): void {
    if (useWinston) {
      defaultLogger.warn(message, { context });
    } else {
      NestLogger.warn(message, context);
    }
  }

  static debug(message: string, context?: string): void {
    if (useWinston) {
      defaultLogger.debug(message, { context });
    } else {
      NestLogger.debug(message, context);
    }
  }

  static verbose(message: string, context?: string): void {
    if (useWinston) {
      defaultLogger.verbose(message, { context });
    } else {
      NestLogger.verbose(message, context);
    }
  }
}
