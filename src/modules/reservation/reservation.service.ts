import { Injectable } from '@nestjs/common';
import type { PageOptionsDto } from 'common/dto';
import dayjs from 'dayjs';
import type { FindConditions, FindManyOptions, FindOneOptions } from 'typeorm';

import {
  EntityDeleteException,
  EntityNotFoundException,
  InvalidReservationError,
  NoAvailableTimeSlots,
} from '../../exceptions/exception';
import { ConfigurationService } from '../../shared/services/configuration.service';
import { TimeSlotDto } from '../table/response/time-slot.dto';
import { TableService } from '../table/table.service';
import type { CreateReservationRequest } from './request/create-reservation.request';
import type { GetReservationQueryParam } from './request/get-reservation.query';
import type { ReservationDto } from './reservation.dto';
import type { ReservationEntity } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';
import type { ReservationPageResponse } from './response';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly tableService: TableService,
    private readonly configurationService: ConfigurationService,
  ) {}

  find(
    findData: FindManyOptions<ReservationEntity>,
  ): Promise<ReservationEntity[]> {
    return this.reservationRepository.find(findData);
  }

  async findOne(
    findData: FindConditions<ReservationEntity>,
    findOneOptions?: FindOneOptions<ReservationEntity>,
  ): Promise<ReservationEntity | undefined> {
    return this.reservationRepository.findOne(findData, findOneOptions);
  }

  async create(
    createReservationRequest: CreateReservationRequest,
  ): Promise<ReservationDto> {
    await this.validateReservationInput(createReservationRequest);

    const tableEntity = await this.tableService.findOne({
      numberOfSeats: createReservationRequest.numberOfSeats,
    });
    const newReservationEntity = this.reservationRepository.create({
      ...createReservationRequest,
      date: dayjs().format('YYYY-MM-DD'),
      table: tableEntity,
    });
    const savedEntity = await this.reservationRepository.save(
      newReservationEntity,
    );

    return savedEntity.toDto();
  }

  private async validateReservationInput(
    createReservationRequest: CreateReservationRequest,
  ) {
    const workingStartTime =
      this.configurationService.get('START_WORKING_HOUR');
    const workingEndTime = this.configurationService.get('END_WORKING_HOUR');

    const formattedReservationStartTime = dayjs(
      `${dayjs().format('YYYY-MM-DD')} ${createReservationRequest.startTime}`,
    );
    const formattedReservationEndTime = dayjs(
      `${dayjs().format('YYYY-MM-DD')} ${createReservationRequest.endTime}`,
    );
    const formattedWorkingStartTime = dayjs(
      `${dayjs().format('YYYY-MM-DD')} ${workingStartTime}`,
    );
    const formattedWorkingEndTime = dayjs(
      `${dayjs().format('YYYY-MM-DD')} ${workingEndTime}`,
    );

    if (
      formattedReservationStartTime.isBefore(formattedWorkingStartTime) ||
      formattedReservationEndTime.isAfter(formattedWorkingEndTime) ||
      formattedReservationEndTime.isBefore(formattedReservationStartTime) ||
      formattedReservationEndTime.isSame(formattedReservationStartTime)
    ) {
      throw new InvalidReservationError();
    }

    const availableTimeSlots = await this.getAvailableTimeSlots(
      createReservationRequest.numberOfSeats,
    );

    for (const timeslot of availableTimeSlots) {
      const formattedSlotStartTime = dayjs(
        `${dayjs().format('YYYY-MM-DD')} ${timeslot.startTime}`,
      );
      const formattedSlotEndTime = dayjs(
        `${dayjs().format('YYYY-MM-DD')} ${timeslot.endTime}`,
      );

      if (
        (formattedReservationStartTime.isAfter(formattedSlotStartTime) ||
          formattedReservationStartTime.isSame(formattedSlotStartTime)) &&
        formattedReservationEndTime.isBefore(formattedSlotEndTime)
      ) {
        return true;
      }
    }

    throw new InvalidReservationError();
  }

  public async get(
    pageOptionsDto: PageOptionsDto,
    reservationQueryParam: GetReservationQueryParam,
  ): Promise<ReservationPageResponse> {
    const queryBuilder =
      this.reservationRepository.createQueryBuilder('reservation');

    if (reservationQueryParam.fromDate) {
      queryBuilder.where('reservation.date >= :fromDate', {
        fromDate: reservationQueryParam.fromDate,
      });
    }

    if (reservationQueryParam.toDate) {
      queryBuilder.andWhere('reservation.date <= :toDate', {
        toDate: reservationQueryParam.toDate,
      });
    }

    const { items, pageMetaDto } = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  public async getTodayReservations(
    pageOptionsDto: PageOptionsDto,
  ): Promise<ReservationPageResponse> {
    const { items, pageMetaDto } = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.date = :date', { date: dayjs().format('YYYY-MM-DD') })
      .paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  public async getById(id: string): Promise<ReservationDto> {
    const entity = await this.reservationRepository.findOne(id);

    if (!entity) {
      throw new EntityNotFoundException();
    }

    return entity.toDto();
  }

  public async getAvailableTimeSlots(
    numberOfSeats: number,
  ): Promise<TimeSlotDto[]> {
    const availableTimeSlots: TimeSlotDto[] = [];

    const tableDto = await this.tableService.getTableBySeats(numberOfSeats);
    const reservationEntities = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.table_id = :table_id', { table_id: tableDto.id })
      .andWhere('reservation.date = :date', {
        date: dayjs().format('YYYY-MM-DD'),
      })
      .orderBy('reservation.startTime', 'ASC')
      .getMany();

    const workingStartTime =
      this.configurationService.get('START_WORKING_HOUR');
    const workingEndTime = this.configurationService.get('END_WORKING_HOUR');

    if (!reservationEntities || reservationEntities.length === 0) {
      availableTimeSlots.push(
        new TimeSlotDto(this.followingTime(workingStartTime), workingEndTime),
      );

      return availableTimeSlots;
    }

    const intervals: ITimeInterval[] = [];

    const validateStartTime = this.validateWorkingTime(
      reservationEntities[0].startTime,
      workingStartTime,
    );

    if (validateStartTime) {
      intervals.push(validateStartTime);
    }

    for (const reservation of reservationEntities) {
      intervals.push(
        {
          reserved: true,
          reservationId: reservation.id,
          time: reservation.startTime.toString(),
        },
        {
          reserved: true,
          reservationId: reservation.id,
          time: reservation.endTime.toString(),
        },
      );
    }

    const validateEndTime = this.validateWorkingTime(
      reservationEntities[reservationEntities.length - 1].endTime,
      workingEndTime,
    );

    if (validateEndTime) {
      intervals.push(validateEndTime);
    }

    for (let index = 0; index < intervals.length - 1; index++) {
      const currentInterval = intervals[index];
      const nextInterval = intervals[index + 1];

      if (!this.isAfterNow(nextInterval)) {
        continue;
      } else if (!this.isAfterNow(currentInterval)) {
        currentInterval.time = dayjs().format('HH:mm:ss');
      }

      if (!currentInterval.reserved && nextInterval.reserved) {
        availableTimeSlots.push(
          new TimeSlotDto(currentInterval.time, nextInterval.time),
        );
      }

      if (currentInterval.reserved && !nextInterval.reserved) {
        availableTimeSlots.push(
          new TimeSlotDto(currentInterval.time, nextInterval.time),
        );
      }

      if (
        currentInterval.reserved &&
        nextInterval.reserved &&
        currentInterval.reservationId !== nextInterval.reservationId &&
        currentInterval.time !== nextInterval.time
      ) {
        availableTimeSlots.push(
          new TimeSlotDto(currentInterval.time, nextInterval.time),
        );
      }
    }

    if (availableTimeSlots.length === 0) {
      throw new NoAvailableTimeSlots();
    }

    return availableTimeSlots;
  }

  private followingTime(time: string) {
    const time1Formatted = dayjs(`${dayjs().format('YYYY-MM-DD')} ${time}`);

    if (time1Formatted.isAfter(dayjs())) {
      return time;
    }

    return dayjs().format('HH:mm:ss');
  }

  private isAfterNow(interval: ITimeInterval) {
    const now = dayjs();
    const startTime = dayjs(`${dayjs().format('YYYY-MM-DD')} ${interval.time}`);

    return startTime.isAfter(now);
  }

  private validateWorkingTime(
    time: Date,
    workingTime: string,
  ): ITimeInterval | undefined {
    const timeFormatted = time.toString();

    if (timeFormatted !== workingTime) {
      return {
        reserved: false,
        reservationId: '0',
        time: workingTime,
      };
    }

    return undefined;
  }

  public async delete(id: string): Promise<ReservationDto | undefined> {
    const entity = await this.reservationRepository.findOne(id);

    if (!entity) {
      throw new EntityNotFoundException();
    }

    if (dayjs(entity.date).isBefore(dayjs())) {
      throw new EntityDeleteException();
    }

    try {
      await this.reservationRepository.delete(id);

      return entity.toDto();
    } catch {
      throw new EntityDeleteException();
    }
  }
}

interface ITimeInterval {
  time: string;
  reservationId: string;
  reserved: boolean;
}
