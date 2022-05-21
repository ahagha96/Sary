import { IsEnum, IsString } from 'class-validator';

import { ChannelEnum, OTPServiceEnum } from '../../../../constants';

export class OTPRedisDto {
  @IsEnum(ChannelEnum)
  channel: ChannelEnum;

  @IsEnum(OTPServiceEnum)
  service: OTPServiceEnum;

  @IsString()
  mobileNumber?: string;

  @IsString()
  nationalId?: string;

  @IsString()
  otp: string;
}
