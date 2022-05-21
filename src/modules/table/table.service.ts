import { Injectable } from '@nestjs/common';
import type { PageOptionsDto } from 'common/dto';
import type { FindConditions, FindManyOptions, FindOneOptions } from 'typeorm';

import {
  DuplicateEntityInsertException,
  EntityDeleteException,
  EntityNotFoundException,
} from '../../exceptions/exception';
import type { CreateTableRequest } from './request/create-table.request';
import type { TablePageResponse } from './response';
import type { TableDto } from './table.dto';
import type { TableEntity } from './table.entity';
import { TableRepository } from './table.repository';

@Injectable()
export class TableService {
  constructor(private readonly tableRepository: TableRepository) {}

  find(findData: FindManyOptions<TableEntity>): Promise<TableEntity[]> {
    return this.tableRepository.find(findData);
  }

  async findOne(
    findData: FindConditions<TableEntity>,
    findOneOptions?: FindOneOptions<TableEntity>,
  ): Promise<TableEntity | undefined> {
    return this.tableRepository.findOne(findData, findOneOptions);
  }

  async create(createTableRequest: CreateTableRequest): Promise<TableDto> {
    const entity = await this.tableRepository.findOne({
      where: { number: createTableRequest.number },
    });

    if (entity) {
      throw new DuplicateEntityInsertException();
    }

    const newTableEntity = this.tableRepository.create({
      ...createTableRequest,
    });
    const savedEntity = await this.tableRepository.save(newTableEntity);

    return savedEntity.toDto();
  }

  public async get(pageOptionsDto: PageOptionsDto): Promise<TablePageResponse> {
    const { items, pageMetaDto } = await this.tableRepository
      .createQueryBuilder('table')
      .paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  public async getById(id: string): Promise<TableDto> {
    const entity = await this.tableRepository.findOne(id);

    if (!entity) {
      throw new EntityNotFoundException();
    }

    return entity.toDto();
  }

  public async getTableBySeats(numberOfSeats: number): Promise<TableDto> {
    const tableEntity = await this.tableRepository
      .createQueryBuilder('table')
      .where('table.numberOfSeats >= :numberOfSeats', { numberOfSeats })
      .orderBy('table.numberOfSeats', 'ASC')
      .getOne();

    if (!tableEntity) {
      throw new EntityNotFoundException();
    }

    return tableEntity.toDto();
  }

  public async delete(id: string): Promise<TableDto | undefined> {
    const entity = await this.tableRepository.findOne(id);

    if (!entity) {
      throw new EntityNotFoundException();
    }

    try {
      await this.tableRepository.delete(id);

      return entity.toDto();
    } catch {
      throw new EntityDeleteException();
    }
  }
}
