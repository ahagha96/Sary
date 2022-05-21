import { ApiProperty } from '@nestjs/swagger';

export class TimeSlotDto {
  @ApiProperty({
    type: String,
  })
  readonly startTime: string;

  @ApiProperty({
    type: String,
  })
  readonly endTime: string;

  constructor(startTime: string, endTime: string) {
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
