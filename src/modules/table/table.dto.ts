import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumberString, IsOptional, Max, Min } from 'class-validator';

import { AbstractDto } from '../../common/dto/abstract.dto';
import { ReservationDto } from '../reservation/reservation.dto';
import type { TableEntity } from './table.entity';

export class TableDto extends AbstractDto {
  @ApiProperty({ type: String, required: true, example: '1234' })
  @IsNumberString()
  number: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 2,
    minimum: 1,
    maximum: 12,
  })
  @Min(1)
  @Max(12)
  @Type(() => Number)
  numberOfSeats: number;

  @ApiProperty({ type: () => ReservationDto, required: true, isArray: true })
  @Type(() => ReservationDto)
  @IsOptional()
  reservations?: ReservationDto[];

  constructor(tableEntity: TableEntity) {
    super(tableEntity);
    this.number = tableEntity.number;
    this.numberOfSeats = Number(tableEntity.numberOfSeats);
    this.reservations = tableEntity.reservations?.toDtos();
  }
}
