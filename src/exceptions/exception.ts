/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable max-classes-per-file */
import { HttpStatus } from '@nestjs/common';

import { ErrorCodes, ErrorDescriptions } from '../constants';
import { ErrorException } from './error.exception';

export class EntityNotFoundException extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.ENTITY_NOT_FOUND,
        message: ErrorDescriptions.ENTITY_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EntityUpdateException extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.ENTITY_UPDATE_FAILED,
        message: ErrorDescriptions.ENTITY_UPDATE_FAILED,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EntityDeleteException extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.ENTITY_DELETE_FAILED,
        message: ErrorDescriptions.ENTITY_DELETE_FAILED,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EntitySelectException extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.ENTITY_SELECT_FAILED,
        message: ErrorDescriptions.ENTITY_SELECT_FAILED,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class EntityInsertException extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.ENTITY_INSERT_FAILED,
        message: ErrorDescriptions.ENTITY_INSERT_FAILED,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class DuplicateEntityInsertException extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.ENTITY_DUP,
        message: ErrorDescriptions.ENTITY_DUP,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class RedisNotConnectedException extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.REDIS_DISCONNECTED,
        message: ErrorDescriptions.REDIS_DISCONNECTED,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class SchemaValidationError extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.INVALID_KEY_PARAM,
        message: `${ErrorDescriptions.INVALID_INPUT}`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PasswordNotMatchingError extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.PASSWORD_NOT_MATCHING,
        message: ErrorDescriptions.PASSWORD_NOT_MATCHING,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidReservationError extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.INVALID_RESERVATION_TIME,
        message: ErrorDescriptions.INVALID_RESERVATION_TIME,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class NoAvailableTimeSlots extends ErrorException {
  constructor() {
    super(
      {
        code: ErrorCodes.NO_AVAILABLE_TIMESLOTS,
        message: ErrorDescriptions.NO_AVAILABLE_TIMESLOTS,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
