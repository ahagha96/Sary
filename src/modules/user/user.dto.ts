import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, Length } from 'class-validator';

import { AbstractDto } from '../../common/dto/abstract.dto';
import { UserRole } from '../../constants';
import type { UserEntity } from './user.entity';

export class UserDto extends AbstractDto {
  @ApiProperty({ type: String, required: true, example: '1234' })
  @IsNumberString()
  @Length(4)
  employeeNumber: string;

  @ApiProperty({ type: String, required: false, example: 'Omar' })
  @Length(1, 50)
  name: string;

  @ApiProperty({ enum: UserRole, required: false, example: UserRole.EMPLOYEE })
  @IsEnum(UserRole)
  role: UserRole;

  constructor(userEntity: UserEntity) {
    super(userEntity);
    this.employeeNumber = userEntity.employeeNumber;
    this.name = userEntity.name;
    this.role = userEntity.role;
  }
}
