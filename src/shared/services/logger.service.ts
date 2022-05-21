import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import winston from 'winston';

import { LogLevelEnum } from '../../constants/log-level';
import { ContextProvider } from '../../providers/context.provider';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  private dateFormat: string;

  constructor(route: string) {
    dayjs.extend(timezone);
    dayjs.extend(utc);

    this.dateFormat = dayjs.utc().add(3, 'h').toISOString();

    this.logger = winston.createLogger({
      levels: winston.config.syslog.levels,
      transports: [new winston.transports.Console()],
      format: winston.format.printf((info) => {
        let message = `${
          this.dateFormat
        } | ${info.level.toUpperCase()} | ${route} | ${info.method} | ${
          info.message
        } `;
        message = info.obj
          ? message + `| data: ${JSON.stringify(info.obj)} `
          : message;

        return message;
      }),
    });
  }

  log(level: LogLevelEnum, message: string, method: string, obj?: unknown) {
    this.logger.log(
      level,
      `[${ContextProvider.getCorrelationId()}] - ${message}`,
      {
        method,
        obj,
      },
    );
  }

  info(message: string, method: string, obj?: unknown) {
    this.logger.log(
      LogLevelEnum.INFO,
      `[${ContextProvider.getCorrelationId()}] - ${message}`,
      {
        method,
        obj,
      },
    );
  }

  warn(message: string, method: string, obj?: unknown) {
    this.logger.log(
      LogLevelEnum.WARNING,
      `[${ContextProvider.getCorrelationId()}] - ${message}`,
      {
        method,
        obj,
      },
    );
  }

  error(message: string, method: string, obj?: unknown) {
    this.logger.log(
      LogLevelEnum.ERROR,
      `[${ContextProvider.getCorrelationId()}] - ${message}`,
      {
        method,
        obj,
      },
    );
  }
}
