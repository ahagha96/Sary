import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RedisService } from '../../../shared/services/redis/redis.service';
import type { UserDto } from '../../user/user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return this.validateRequest(context);
  }

  async validateRequest(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserDto = request.user;

    const userDto: UserDto = JSON.parse(
      (await this.redisService.get(`${user.id}`)) as string,
    );

    if (!userDto) {
      return false;
    }

    const hasRole = () => roles.includes(userDto.role);
    let hasPermission = false;

    if (hasRole()) {
      hasPermission = true;
    }

    return hasPermission;
  }
}
