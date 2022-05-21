import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { AbstractDto } from '../../common/dto/abstract.dto';
import { IsDate } from '../../decorators';
import { TableDto } from '../table/table.dto';
import type { ReservationEntity } from './reservation.entity';

export class ReservationDto extends AbstractDto {
  @ApiProperty({
    type: Date,
    required: true,
  })
  @Type(() => String)
  startTime: Date;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @Type(() => String)
  endTime: Date;

  @ApiProperty({ description: 'YYYY-MM-DD', type: String, required: true })
  @IsDate()
  date: string;

  @ApiProperty({ type: () => TableDto, required: true })
  @Type(() => TableDto)
  @IsOptional()
  table?: TableDto;

  constructor(reservationEntity: ReservationEntity) {
    super(reservationEntity);
    this.startTime = reservationEntity.startTime;
    this.endTime = reservationEntity.endTime;
    this.date = reservationEntity.date;
    this.table = reservationEntity.table?.toDto();
  }
}
