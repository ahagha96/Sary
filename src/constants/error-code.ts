export interface IError {
  code: ErrorCodes;
  message: string;
  errors?: IErrorDetail[];
}

export interface IErrorDetail {
  errorCode: ErrorCodes;
  message: ErrorDescriptions;
}

export enum ErrorCodes {
  ENTITY_NOT_FOUND = 'E001',
  ENTITY_UPDATE_FAILED = 'E002',
  ENTITY_DELETE_FAILED = 'E003',
  ENTITY_SELECT_FAILED = 'E004',
  ENTITY_INSERT_FAILED = 'E005',
  ENTITY_DUP = 'E006',
  REDIS_DISCONNECTED = 'E007',
  UNKNOWN_EXCEPTION = 'E008',
  PASSWORD_NOT_MATCHING = 'E009',
  INVALID_KEY_PARAM = 'E010',
  INVALID_RESERVATION_TIME = 'E011',
  NO_AVAILABLE_TIMESLOTS = 'E012',
}

export enum ErrorDescriptions {
  // system errors
  ENTITY_NOT_FOUND = 'Entity not found',
  ENTITY_UPDATE_FAILED = 'Failed to update entity',
  ENTITY_DELETE_FAILED = 'Failed to delete entity',
  ENTITY_SELECT_FAILED = 'Failed to find entity',
  ENTITY_INSERT_FAILED = 'Failed to insert entity',
  ENTITY_DUP = 'Duplicate entity',
  REDIS_DISCONNECTED = 'Failed to connect to redis',
  UNKNOWN_EXCEPTION = 'Unknown exception occurred',
  PASSWORD_NOT_MATCHING = 'Invalid password',
  INVALID_INPUT = 'Invalid parameters',
  INVALID_RESERVATION_TIME = 'Invalid reservation time',
  NO_AVAILABLE_TIMESLOTS = 'No available time slots',
}
