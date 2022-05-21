import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageOptionsDto } from '../../common/dto';
import { UserRole } from '../../constants/user-role';
import { GlobalHeaders } from '../../decorators';
import { hasRoles } from '../../decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateTableRequest } from './request/create-table.request';
import { TablePageResponse } from './response';
import { TableDto } from './table.dto';
import { TableService } from './table.service';

@GlobalHeaders()
@Controller('tables')
@ApiTags('Tables Management')
export class TableController {
  constructor(private tableService: TableService) {}

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiResponse({
    status: 201,
    type: TableDto,
    description: 'Table has been created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to create table',
  })
  create(@Body() createTableRequest: CreateTableRequest): Promise<TableDto> {
    return this.tableService.create(createTableRequest);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiResponse({
    status: 200,
    type: TablePageResponse,
    description: 'Return all registered tables',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to return registered tables',
  })
  get(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<TablePageResponse> {
    return this.tableService.get(pageOptionsDto);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    type: TableDto,
    description: 'Table fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to retrieve table',
  })
  getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<TableDto> {
    return this.tableService.getById(id);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: TableDto,
    description: 'Table deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to delete table',
  })
  delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TableDto | undefined> {
    return this.tableService.delete(id);
  }
}
