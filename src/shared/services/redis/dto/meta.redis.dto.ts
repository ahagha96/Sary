import { IsEnum, IsNumber, IsString } from 'class-validator';

import { ChannelEnum, OTPServiceEnum } from '../../../../constants';

export class OTPMetaRedisDto {
  @IsEnum(ChannelEnum)
  channel: ChannelEnum;

  @IsEnum(OTPServiceEnum)
  service: OTPServiceEnum;

  @IsString()
  nationalId?: string;

  @IsString()
  mobileNumber?: string;

  @IsNumber()
  remainingRetry: number;
}
