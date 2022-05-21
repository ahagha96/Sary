import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageOptionsDto } from '../../common/dto';
import { UserRole } from '../../constants';
import { GlobalHeaders, hasRoles } from '../../decorators';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserRequest } from './request';
import { LoginUserRequest } from './request/login-user.request';
import type { LoginUserResponse } from './response';
import { UserPageResponse } from './response';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@GlobalHeaders()
@Controller('users')
@ApiTags('Users Management')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: UserDto,
    description: 'User has been created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to create user',
  })
  create(@Body() createUserRequest: CreateUserRequest): Promise<UserDto> {
    return this.userService.create(createUserRequest);
  }

  @Post('login')
  @ApiResponse({
    status: 200,
    type: String,
    description: 'User authenticated successfully. JWT token will be returned',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authenticate user',
  })
  login(@Body() loginRequest: LoginUserRequest): Promise<LoginUserResponse> {
    return this.userService.login(loginRequest);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiResponse({
    status: 200,
    type: UserPageResponse,
    description: 'Return all registered users',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to return registered users',
  })
  get(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<UserPageResponse> {
    return this.userService.get(pageOptionsDto);
  }
}
