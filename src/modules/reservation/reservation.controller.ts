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
import { TimeSlotDto } from '../table/response/time-slot.dto';
import { CreateReservationRequest } from './request';
import { GetReservationQueryParam } from './request/get-reservation.query';
import { ReservationDto } from './reservation.dto';
import { ReservationService } from './reservation.service';
import { ReservationPageResponse } from './response';

@GlobalHeaders()
@Controller('reservations')
@ApiTags('Reservations Management')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  @ApiResponse({
    status: 201,
    type: ReservationDto,
    description: 'Reservation has been created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to create reservation',
  })
  create(
    @Body() createReservationRequest: CreateReservationRequest,
  ): Promise<ReservationDto> {
    return this.reservationService.create(createReservationRequest);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: ReservationPageResponse,
    description: 'Return all registered reservations',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to return registered reservations',
  })
  get(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
    @Query()
    reservationQueryParam: GetReservationQueryParam,
  ): Promise<ReservationPageResponse> {
    return this.reservationService.get(pageOptionsDto, reservationQueryParam);
  }

  @hasRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('available-time-slots')
  @ApiResponse({
    status: 200,
    type: TimeSlotDto,
    description: 'Table fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to retrieve table',
  })
  getTableBySeats(
    @Query('number') numberOfSeats: number,
  ): Promise<TimeSlotDto[]> {
    return this.reservationService.getAvailableTimeSlots(numberOfSeats);
  }

  @hasRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('today-reservations')
  @ApiResponse({
    status: 200,
    type: ReservationPageResponse,
    description: 'Table fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to retrieve table',
  })
  getTodayReservations(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
  ): Promise<ReservationPageResponse> {
    return this.reservationService.getTodayReservations(pageOptionsDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ReservationDto,
    description: 'Reservation fetched successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to retrieve reservation',
  })
  getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ReservationDto> {
    return this.reservationService.getById(id);
  }

  @hasRoles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ReservationDto,
    description: 'Reservation deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to delete reservation',
  })
  delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ReservationDto | undefined> {
    return this.reservationService.delete(id);
  }
}
