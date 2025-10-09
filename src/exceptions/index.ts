/**
 * Base Bayarcash error class
 */
export class BayarcashError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BayarcashError';
    Object.setPrototypeOf(this, BayarcashError.prototype);
  }
}

/**
 * Validation error (HTTP 422)
 */
export class ValidationException extends BayarcashError {
  public errors: Record<string, any>;

  constructor(errors: Record<string, any>) {
    const message = ValidationException.formatErrors(errors);
    super(message);
    this.name = 'ValidationException';
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }

  private static formatErrors(errors: Record<string, any>): string {
    if (errors.message) {
      return errors.message;
    }
    if (errors.errors) {
      const errorMessages = Object.entries(errors.errors)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return `${field}: ${messages.join(', ')}`;
          }
          return `${field}: ${messages}`;
        })
        .join('; ');
      return `Validation failed: ${errorMessages}`;
    }
    return 'Validation failed';
  }
}

/**
 * Resource not found error (HTTP 404)
 */
export class NotFoundException extends BayarcashError {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundException';
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

/**
 * Action failed error (HTTP 400)
 */
export class FailedActionException extends BayarcashError {
  public details?: any;

  constructor(details?: any) {
    const message = FailedActionException.extractMessage(details);
    super(message);
    this.name = 'FailedActionException';
    this.details = details;
    Object.setPrototypeOf(this, FailedActionException.prototype);
  }

  private static extractMessage(details: any): string {
    if (typeof details === 'string') {
      return details;
    }
    if (details && details.message) {
      return details.message;
    }
    return 'Action failed';
  }
}

/**
 * Rate limit exceeded error (HTTP 429)
 */
export class RateLimitExceededException extends BayarcashError {
  public resetAt?: number;

  constructor(resetAt?: number) {
    const message = resetAt
      ? `Rate limit exceeded. Resets at ${new Date(resetAt * 1000).toISOString()}`
      : 'Rate limit exceeded';
    super(message);
    this.name = 'RateLimitExceededException';
    this.resetAt = resetAt;
    Object.setPrototypeOf(this, RateLimitExceededException.prototype);
  }
}

/**
 * Request timeout error
 */
export class TimeoutException extends BayarcashError {
  public output: any;

  constructor(output: any = []) {
    super('Request timed out');
    this.name = 'TimeoutException';
    this.output = output;
    Object.setPrototypeOf(this, TimeoutException.prototype);
  }
}
