import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, Max, Min } from 'class-validator';

export class CreateTableRequest {
  @ApiProperty({ type: String, required: true, example: '2' })
  @IsNumberString()
  number: string;

  @ApiProperty({ type: Number, required: true, example: 1 })
  @IsNumber()
  @Min(1)
  @Max(12)
  numberOfSeats: number;
}
