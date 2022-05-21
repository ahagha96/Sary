/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import 'source-map-support/register';

import { compact, map } from 'lodash';
import { SelectQueryBuilder } from 'typeorm';

import type { AbstractEntity } from '../common/abstract.entity';
import type { AbstractDto } from '../common/dto/abstract.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import type { PageOptionsDto } from '../common/dto/page-options.dto';
import { VIRTUAL_COLUMN_KEY } from '../decorators/virtual-column.decorator';
import { UtilsService } from '../providers';

declare global {
  export type Uuid = string & { _uuidBrand: undefined };

  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: any): Dto[];

    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      // FIXME make option type visible from entity
      options?: any,
    ): PageDto<Dto>;
  }
}

declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
      options?: Partial<{ takeAll: boolean }>,
    ): Promise<{ items: Entity[]; pageMetaDto: PageMetaDto }>;
  }
}

Array.prototype.toDtos = function <
  Entity extends AbstractEntity<Dto>,
  Dto extends AbstractDto,
>(options?: any): Dto[] {
  return compact(
    map<Entity, Dto>(this, (item) => item.toDto(options as never)),
  );
};

Array.prototype.toPageDto = function (pageMetaDto: PageMetaDto, options?: any) {
  return new PageDto(this.toDtos(options), pageMetaDto);
};

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
) {
  let selectQueryBuilder = this.skip(pageOptionsDto.skip).take(
    pageOptionsDto.take,
  );

  if (pageOptionsDto.includes) {
    for (const includable of pageOptionsDto.includes) {
      selectQueryBuilder = this.leftJoinAndSelect(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${this.alias}.${includable}`,
        includable,
      );
    }
  }

  if (pageOptionsDto.filters) {
    for (const filter of pageOptionsDto.filters) {
      selectQueryBuilder = this.andWhere(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${UtilsService.getColumnName(this.alias, filter.name)} = '${String(
          filter.value,
        )}'`,
      );
    }
  }

  const sort = pageOptionsDto.sort
    ? UtilsService.getColumnName(this.alias, pageOptionsDto.sort)
    : UtilsService.getColumnName(this.alias, 'createdAt'); // default

  selectQueryBuilder = this.orderBy(sort, pageOptionsDto.order);

  const itemCount = await selectQueryBuilder.getCount();

  const { entities, raw } = await selectQueryBuilder.getRawAndEntities();

  const items = entities.map((entitiy, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entitiy) ?? {};
    const item = raw[index];

    for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
      entitiy[propertyKey] = item[name];
    }

    return entitiy;
  });

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return { items, pageMetaDto };
};
