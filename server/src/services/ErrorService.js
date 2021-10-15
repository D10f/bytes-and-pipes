class ErrorService {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

export class BadRequestError extends ErrorService {
  constructor(message) {
    super(400, message);
  }
}

export class UnauthorizedError extends ErrorService {
  constructor(message) {
    super(401, message);
  }
}

export class ForbiddenError extends ErrorService {
  constructor(message) {
    super(403, message);
  }
}

export class NotFoundError extends ErrorService {
  constructor(message) {
    super(404, message);
  }
}

export class RequestTimeoutError extends ErrorService {
  constructor(message) {
    super(408, message);
  }
}

export class TooManyRequests extends ErrorService {
  constructor(message) {
    super(429, message);
  }
}

