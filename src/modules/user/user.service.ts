import { Injectable } from '@nestjs/common';
import type { PageOptionsDto } from 'common/dto';
import type { FindConditions, FindManyOptions, FindOneOptions } from 'typeorm';

import { UserRole } from '../../constants';
import { DuplicateEntityInsertException } from '../../exceptions';
import {
  EntityNotFoundException,
  PasswordNotMatchingError,
} from '../../exceptions/exception';
import { ConfigurationService } from '../../shared/services/configuration.service';
import { RedisService } from '../../shared/services/redis/redis.service';
import { AuthService } from '../auth/auth.service';
import type { CreateUserRequest } from './request';
import type { LoginUserRequest } from './request/login-user.request';
import type { UserPageResponse } from './response';
import { LoginUserResponse } from './response';
import type { UserDto } from './user.dto';
import type { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly configurationService: ConfigurationService,
  ) {}

  find(findData: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    return this.userRepository.find(findData);
  }

  async findOne(
    findData: FindConditions<UserEntity>,
    findOneOptions?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | undefined> {
    return this.userRepository.findOne(findData, findOneOptions);
  }

  async createDefaultUser() {
    const superuserNumber = this.configurationService.get(
      'DB_SUPERUSER_NUMBER',
    );
    const superuserPassword = this.configurationService.get(
      'DB_SUPERUSER_PASSWORD',
    );

    const userEntity = await this.userRepository.findOne({
      where: {
        employeeNumber: superuserNumber,
      },
    });

    if (!userEntity) {
      const hashedPassword = await this.authService.hashPassword(
        superuserPassword,
      );
      const newEntity = this.userRepository.create({
        employeeNumber: superuserNumber,
        name: 'superuser',
        role: UserRole.ADMIN,
        password: hashedPassword,
      });
      await this.userRepository.save(newEntity);
    }

    return userEntity;
  }

  async create(createUserRequest: CreateUserRequest): Promise<UserDto> {
    const entity = await this.userRepository.findOne({
      where: { employeeNumber: createUserRequest.employeeNumber },
    });

    if (entity) {
      throw new DuplicateEntityInsertException();
    }

    const hashedPassword = await this.authService.hashPassword(
      createUserRequest.password,
    );

    const newUserEntity = this.userRepository.create({
      ...createUserRequest,
      password: hashedPassword,
    });
    const savedEntity = await this.userRepository.save(newUserEntity);

    return savedEntity.toDto();
  }

  async login(loginUserRequest: LoginUserRequest): Promise<LoginUserResponse> {
    const userDto = await this.validateUser(
      loginUserRequest.employeeNumber,
      loginUserRequest.password,
    );

    const accessToken = await this.authService.generateJWT(userDto);

    await this.redisService.saveJSON(
      `${userDto.id}`,
      userDto,
      false,
      this.configurationService.getNumber('JWT_EXPIRATION_REDIS'),
    );

    return new LoginUserResponse(accessToken);
  }

  private async validateUser(
    employeeNumber: string,
    password: string,
  ): Promise<UserDto> {
    if (this.isSuperUser(employeeNumber, password)) {
      return {
        employeeNumber,
        name: 'Superuser',
        role: UserRole.ADMIN,
      };
    }

    const userEntity = await this.userRepository.findOne(
      { employeeNumber },
      {
        select: [
          'id',
          'name',
          'employeeNumber',
          'role',
          'password',
          'createdAt',
          'updatedAt',
        ],
      },
    );

    if (!userEntity) {
      throw new EntityNotFoundException();
    }

    const isPasswordMatching = await this.authService.comparePasswords(
      password,
      userEntity.password,
    );

    if (isPasswordMatching) {
      return userEntity.toDto();
    }

    throw new PasswordNotMatchingError();
  }

  public async get(pageOptionsDto: PageOptionsDto): Promise<UserPageResponse> {
    const { items, pageMetaDto } = await this.userRepository
      .createQueryBuilder('user')
      .paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  private isSuperUser(employeeNumber: string, password: string) {
    const superuserNumber = this.configurationService.get(
      'DB_SUPERUSER_NUMBER',
    );
    const superuserPassword = this.configurationService.get(
      'DB_SUPERUSER_PASSWORD',
    );

    return superuserNumber === employeeNumber && superuserPassword === password;
  }
}
