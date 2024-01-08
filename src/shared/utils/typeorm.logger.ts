import { Logger } from 'typeorm';
import { Logger as WinstonLogger } from './winston.logger';

interface TypeOrmQueryError extends Error {
  hint: string;
}

class Warning extends Error {
  name = 'Warning';
}

export class TypeOrmLogger implements Logger {
  log(level: 'log' | 'info' | 'warn', message: string): void {
    switch (level) {
      case 'warn':
        WinstonLogger.warn(message, 'TypeORM');
        break;
      default:
        WinstonLogger.log(message, 'TypeORM');
    }
  }
  private _replaceParams(query: string, parameters?: any[]): string {
    let sql = query;
    if (parameters && parameters.length) {
      for (let i = 0; i < parameters.length; i++) {
        const replaceParameter = (parameter: any): string => {
          if (typeof parameter === 'string') return `'${parameter}'`;
          if (typeof parameter === 'number') return `${parameter}`;
          if (typeof parameter === 'boolean') return `${parameter}`;
          if (parameter instanceof Date)
            return `'${parameter.toISOString()}'::timestamp`;
          if (parameter === null) return `null`;
          if (typeof parameter === 'object' && parameter.type === 'Polygon')
            return `'${JSON.stringify(parameter)}'`;
          return `:parameter_${i}`;
        };
        if (Array.isArray(parameters[i])) {
          sql = sql.replace(
            `$${i + 1}`,
            parameters[i].map((p) => replaceParameter(p)).join(', '),
          );
        } else {
          sql = sql.replace(`$${i + 1}`, replaceParameter(parameters[i]));
        }
      }
      sql += '; -- PARAMETERS: ' + this.stringifyParams(parameters);
    }
    return sql;
  }

  // eslint-disable-next-line
  logQuery(query: string, parameters?: any[]): void {
    // const sql = this._replaceParams(query, parameters)
    // WinstonLogger.log(`Query log: ${sql}`, 'TypeORM')
  }

  logQueryError(
    error: TypeOrmQueryError,
    query: string,
    parameters?: any[],
  ): void {
    const sql = this._replaceParams(query, parameters);
    WinstonLogger.error(
      `Query failed: ${sql}\n\n${error.hint}`,
      error.stack,
      'TypeORM',
    );
  }

  logQuerySlow(time: number): void {
    WinstonLogger.warn(
      `${new Warning(`Query was slow (${time}ms)`).stack}`,
      'TypeORM',
    );
  }

  logSchemaBuild(message: string): void {
    WinstonLogger.log(`Schema Build: ${message}`, 'TypeORM');
  }

  logMigration(message: string): void {
    WinstonLogger.log(`Migration: ${message}`, 'TypeORM');
  }

  protected stringifyParams(parameters: any[]): any {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
