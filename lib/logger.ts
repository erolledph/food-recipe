/**
 * Structured logging utility for production monitoring
 * Provides consistent log format for error tracking and debugging
 */

declare const process: { env: { NODE_ENV?: string } }

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogContext {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: {
    message: string
    stack?: string
    code?: string
  }
  userId?: string
  requestId?: string
  endpoint?: string
}

/**
 * Format error for logging
 */
function formatError(error: unknown): LogContext['error'] {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      code: (error as any).code
    }
  }

  return {
    message: String(error)
  }
}

/**
 * Log error with structured format
 */
export function logError(
  message: string,
  error?: unknown,
  context?: Record<string, any>
): void {
  const logContext: LogContext = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message,
    context,
    error: error ? formatError(error) : undefined
  }

  // For production, this would send to a logging service
  // Examples: Sentry, LogRocket, Datadog, CloudWatch, etc.
  console.error(JSON.stringify(logContext))
}

/**
 * Log warning
 */
export function logWarn(
  message: string,
  context?: Record<string, any>
): void {
  const logContext: LogContext = {
    timestamp: new Date().toISOString(),
    level: 'warn',
    message,
    context
  }

  console.warn(JSON.stringify(logContext))
}

/**
 * Log info
 */
export function logInfo(
  message: string,
  context?: Record<string, any>
): void {
  const logContext: LogContext = {
    timestamp: new Date().toISOString(),
    level: 'info',
    message,
    context
  }

  console.log(JSON.stringify(logContext))
}

/**
 * Log debug (only in development)
 */
export function logDebug(
  message: string,
  context?: Record<string, any>
): void {
  // Check for development environment
  const isDev = typeof process !== 'undefined' 
    ? process.env.NODE_ENV !== 'production'
    : true

  if (isDev) {
    const logContext: LogContext = {
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      context
    }

    console.log(JSON.stringify(logContext))
  }
}

/**
 * Log security event
 */
export function logSecurityEvent(
  eventType: string,
  details: Record<string, any>
): void {
  const logContext: LogContext = {
    timestamp: new Date().toISOString(),
    level: 'warn',
    message: `Security Event: ${eventType}`,
    context: {
      eventType,
      ...details
    }
  }

  console.warn(JSON.stringify(logContext))
}

/**
 * Log API request
 */
export function logApiRequest(
  method: string,
  path: string,
  statusCode?: number,
  duration?: number,
  error?: unknown
): void {
  const errorObj = error ? formatError(error) : undefined
  
  const logContext: LogContext = {
    timestamp: new Date().toISOString(),
    level: statusCode && statusCode >= 500 ? 'error' : 'info',
    message: `${method} ${path}`,
    context: {
      method,
      path,
      statusCode,
      durationMs: duration
    },
    error: errorObj
  }

  if (statusCode && statusCode >= 500) {
    console.error(JSON.stringify(logContext))
  } else {
    console.log(JSON.stringify(logContext))
  }
}

/**
 * Log rate limit event
 */
export function logRateLimitEvent(ip: string, endpoint: string): void {
  logSecurityEvent('RATE_LIMIT_EXCEEDED', {
    ip,
    endpoint
  })
}

/**
 * Log authentication failure
 */
export function logAuthFailure(reason: string, context?: Record<string, any>): void {
  logSecurityEvent('AUTH_FAILURE', {
    reason,
    ...context
  })
}

/**
 * Log validation failure
 */
export function logValidationFailure(
  endpoint: string,
  errors: string[],
  context?: Record<string, any>
): void {
  logWarn(`Validation failed at ${endpoint}`, {
    endpoint,
    errors,
    ...context
  })
}
