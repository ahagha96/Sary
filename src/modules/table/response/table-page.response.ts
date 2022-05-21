import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto';
import { TableDto } from '../table.dto';

export class TablePageResponse {
  @ApiProperty({
    type: TableDto,
    isArray: true,
  })
  readonly data: TableDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: TableDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
