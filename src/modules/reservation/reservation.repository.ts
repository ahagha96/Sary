import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { ReservationEntity } from './reservation.entity';

@EntityRepository(ReservationEntity)
export class ReservationRepository extends Repository<ReservationEntity> {}
