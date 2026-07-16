import { StructuredError } from '../types/form990n.types';

export class Tax990Error extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly correlationId?: string,
  ) {
    super(message);
    this.name = 'Tax990Error';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthError extends Tax990Error {
  constructor(message: string, correlationId?: string) {
    super(message, 'AUTH_ERROR', 401, correlationId);
    this.name = 'AuthError';
  }
}

export class ValidationError extends Tax990Error {
  constructor(
    message: string,
    public readonly errors: StructuredError[],
    correlationId?: string,
  ) {
    super(message, 'VALIDATION_ERROR', 400, correlationId);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends Tax990Error {
  constructor(message: string, correlationId?: string) {
    super(message, 'RATE_LIMIT_ERROR', 429, correlationId);
    this.name = 'RateLimitError';
  }
}

export class NotFoundError extends Tax990Error {
  constructor(message: string, correlationId?: string) {
    super(message, 'NOT_FOUND', 404, correlationId);
    this.name = 'NotFoundError';
  }
}
