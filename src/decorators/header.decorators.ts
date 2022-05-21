import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';

export function GlobalHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'accept-language',
      description: 'Response messages language',
      required: false,
      example: 'ar',
    }),
    ApiHeader({
      name: 'x-correlation-id',
      description: 'Correlation id to trace the request UUID',
      required: false,
      example: 'c2a2a553-15e7-47b2-99dd-5883f99e2ad1',
    }),
    ApiResponse({
      status: 422,
      description: 'Schema validation error',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}
