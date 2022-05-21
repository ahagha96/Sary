import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto';
import { ReservationDto } from '../reservation.dto';

export class ReservationPageResponse {
  @ApiProperty({
    type: ReservationDto,
    isArray: true,
  })
  readonly data: ReservationDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: ReservationDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
