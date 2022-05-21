import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';


export class HeaderDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  correlationId: string;
}
