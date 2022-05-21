import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

import { IsTime } from '../../../decorators';

export class CreateReservationRequest {
  @ApiProperty({ type: Number, required: true, example: 1 })
  @IsNumber()
  @Min(1)
  @Max(12)
  numberOfSeats: number;

  @ApiProperty({
    type: String,
    required: true,
    example: 'HH:mm',
  })
  @IsTime()
  startTime: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'HH:mm',
  })
  @IsTime()
  endTime: string;
}
