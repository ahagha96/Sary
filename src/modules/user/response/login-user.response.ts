import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponse {
  @ApiProperty({
    type: String,
  })
  accesstoken: string;

  constructor(accesstoken: string) {
    this.accesstoken = accesstoken;
  }
}
