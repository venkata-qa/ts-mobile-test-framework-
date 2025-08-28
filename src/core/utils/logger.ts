import * as log4js from 'log4js';
import { injectable } from 'tsyringe';

/**
 * Logger utility class that provides consistent logging across the framework
 * Uses log4js under the hood with configurable log levels
 */
@injectable()
export class Logger {
  private logger: log4js.Logger;

  /**
   * Creates a new logger instance for the specified context
   * @param context The class or component name that is using the logger
   */
  constructor(private context: string) {
    this.configureLogger();
    this.logger = log4js.getLogger(context);
    this.logger.level = process.env.LOG_LEVEL || 'info';
  }

  /**
   * Configure the logger with appropriate appenders and layouts
   */
  private configureLogger(): void {
    log4js.configure({
      appenders: {
        console: { type: 'console', layout: { type: 'colored' } },
        file: { 
          type: 'file', 
          filename: 'logs/test.log', 
          maxLogSize: 10485760, 
          backups: 3, 
          compress: true 
        }
      },
      categories: {
        default: { 
          appenders: ['console', 'file'], 
          level: process.env.LOG_LEVEL || 'info' 
        }
      }
    });
  }

  /**
   * Log a message at debug level
   * @param message The message to log
   * @param args Optional arguments to include
   */
  debug(message: string, ...args: any[]): void {
    this.logger.debug(`[${this.context}] ${message}`, ...args);
  }

  /**
   * Log a message at info level
   * @param message The message to log
   * @param args Optional arguments to include
   */
  info(message: string, ...args: any[]): void {
    this.logger.info(`[${this.context}] ${message}`, ...args);
  }

  /**
   * Log a message at warn level
   * @param message The message to log
   * @param args Optional arguments to include
   */
  warn(message: string, ...args: any[]): void {
    this.logger.warn(`[${this.context}] ${message}`, ...args);
  }

  /**
   * Log a message at error level
   * @param message The message to log
   * @param args Optional arguments to include
   */
  error(message: string | Error, ...args: any[]): void {
    if (message instanceof Error) {
      this.logger.error(`[${this.context}] ${message.message}`, message.stack, ...args);
    } else {
      this.logger.error(`[${this.context}] ${message}`, ...args);
    }
  }

  /**
   * Log a message at fatal level
   * @param message The message to log
   * @param args Optional arguments to include
   */
  fatal(message: string, ...args: any[]): void {
    this.logger.fatal(`[${this.context}] ${message}`, ...args);
  }
}
