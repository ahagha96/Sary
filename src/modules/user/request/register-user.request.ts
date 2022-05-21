import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

import { UserRole } from '../../../constants';

export class CreateUserRequest {
  @ApiProperty({ type: String, required: true, example: '1234' })
  @IsNumberString()
  @Length(4)
  employeeNumber: string;

  @ApiProperty({ type: String, required: true, example: 'Omar' })
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty({ type: String, required: true, example: 'abc123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, required: true, default: UserRole.EMPLOYEE })
  @IsEnum(UserRole)
  role: UserRole;
}
