import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { TableEntity } from './table.entity';

@EntityRepository(TableEntity)
export class TableRepository extends Repository<TableEntity> {}
