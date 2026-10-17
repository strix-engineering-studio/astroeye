// import "server-only";

import * as Sentry from "@sentry/nextjs";
import pino, { type Logger, type LoggerOptions } from "pino";
import { APP_ENV } from "../env";

const isDevelopment = APP_ENV == "development";

const loggerOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),

  base: {
    service: process.env.LOG_SERVICE_NAME || "MagicalStones-admin-console",

    environment: APP_ENV || "development",
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },

  redact: {
    paths: [
      // Common sensitive fields
      "password",
      "token",
      "accessToken",
      "refreshToken",
      "idToken",
      "authorization",
      "cookie",
      "set-cookie",
      "apiKey",
      "secret",
      "clientSecret",

      // Nested sensitive fields
      "*.password",
      "*.token",
      "*.accessToken",
      "*.refreshToken",
      "*.idToken",
      "*.authorization",
      "*.cookie",
      "*.apiKey",
      "*.secret",
      "*.clientSecret",

      // Request headers
      "req.headers.authorization",
      "req.headers.cookie",
    ],

    censor: "[REDACTED]",
  },

  // Send Pino logs to Sentry.
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: process.env.LOG_LEVEL || "debug",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          singleLine: false,
        },
      },
    ],
  },
};

/**
 * Main application logger.
 *
 * Development:
 *   Pino -> terminal
 *
 * Production:
 *   Pino -> stdout JSON
 *
 * Sentry:
 *   Pino -> Sentry Logs
 */
type ApplicationLogger = Omit<
  Logger,
  "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent"
> & {
  fatal: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
  trace: (...args: unknown[]) => void;
  silent: (...args: unknown[]) => void;
};

export const logger = pino(loggerOptions) as ApplicationLogger;

/**
 * Create a child logger with permanent context.
 *
 * Example:
 *
 * const log = createLogger({
 *   module: 'webinars',
 *   action: 'registration',
 * });
 */
export function createLogger(context?: Record<string, unknown>): Logger {
  if (!context || Object.keys(context).length === 0) {
    return logger;
  }

  return logger.child(context);
}

/**
 * Create a logger for a specific feature/module.
 *
 * Example:
 *
 * const log = createModuleLogger('webinars');
 *
 * log.info(
 *   { webinarId },
 *   'Webinar fetched',
 * );
 */
export function createModuleLogger(
  module: string,
  context?: Record<string, unknown>,
): Logger {
  return logger.child({
    module,
    ...context,
  });
}

/**
 * Create a request-scoped logger.
 *
 * Example:
 *
 * const log = createRequestLogger(requestId);
 */
export function createRequestLogger(
  requestId: string,
  context?: Record<string, unknown>,
): Logger {
  return logger.child({
    requestId,
    ...context,
  });
}

/**
 * Log an error to:
 *
 * 1. Pino
 * 2. Sentry Error Monitoring
 *
 * The Pino error log is also available
 * through Sentry's Pino integration.
 */
export function logError(
  error: unknown,
  message: string,
  context?: Record<string, unknown>,
): void {
  if (error instanceof Error) {
    logger.error(
      {
        err: error,
        ...context,
      },
      message,
    );

    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext("application", context);
      }

      scope.setTag("error_message", message);

      Sentry.captureException(error);
    });

    return;
  }

  logger.error(
    {
      error,
      ...context,
    },
    message,
  );

  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("application", context);
    }

    scope.setTag("error_message", message);

    Sentry.captureMessage(`${message}: ${String(error)}`, "error");
  });
}
