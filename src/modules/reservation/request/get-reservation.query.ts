import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IsDate } from '../../../decorators';

export class GetReservationQueryParam {
  @IsOptional()
  @IsDate()
  @ApiProperty({
    required: false,
    format: 'YYYY-MM-DD',
    description: 'YYYY-MM-DD',
    example: '2020-11-10',
  })
  fromDate?: string;

  @IsOptional()
  @IsDate()
  @ApiProperty({
    required: false,
    format: 'YYYY-MM-DD',
    description: 'YYYY-MM-DD',
    example: '2020-11-10',
  })
  toDate?: string;
}
