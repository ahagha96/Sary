import { IsEnum, IsNumber } from 'class-validator';

import { ChannelEnum, OTPServiceEnum } from '../../../../constants';

export class OTPServiceConfigRedisDto {
  @IsEnum(ChannelEnum)
  channel: ChannelEnum;

  @IsEnum(OTPServiceEnum)
  service: OTPServiceEnum;

  @IsNumber()
  metaTTL: number;

  @IsNumber()
  otpTTL: number;

  @IsNumber()
  maxRetry: number;

  @IsNumber()
  otpLength: number;
}
