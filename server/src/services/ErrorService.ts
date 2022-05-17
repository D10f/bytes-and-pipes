export class ErrorService {
  constructor(public status: number, public message: string) {
    this.status = status;
    this.message = message;
  }
}

export class BadRequestError extends ErrorService {
  constructor(public message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends ErrorService {
  constructor(public message: string) {
    super(401, message);
  }
}

export class ForbiddenError extends ErrorService {
  constructor(public message: string) {
    super(403, message);
  }
}

export class NotFoundError extends ErrorService {
  constructor(public message: string) {
    super(404, message);
  }
}

export class RequestTimeoutError extends ErrorService {
  constructor(public message: string) {
    super(408, message);
  }
}

export class TooManyRequests extends ErrorService {
  constructor(public message: string) {
    super(429, message);
  }
}
