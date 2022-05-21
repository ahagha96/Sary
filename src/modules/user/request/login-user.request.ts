import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Length, MinLength } from 'class-validator';

export class LoginUserRequest {
  @ApiProperty({ type: String, required: true, example: '1234' })
  @IsNumberString()
  @Length(4)
  employeeNumber: string;

  @ApiProperty({ type: String, required: true, example: 'abc123' })
  @IsString()
  @MinLength(6)
  password: string;
}
