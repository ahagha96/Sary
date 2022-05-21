import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { TableEntity } from '../table/table.entity';
import { ReservationDto } from './reservation.dto';

@Entity({ name: 't_reservation' })
export class ReservationEntity extends AbstractEntity<ReservationDto> {
  @Column({
    nullable: false,
    type: 'time without time zone',
  })
  startTime: Date;

  @Column({
    nullable: false,
    type: 'time without time zone',
  })
  endTime: Date;

  @Column({
    nullable: false,
    type: 'date',
  })
  date: string;

  @ManyToOne(() => TableEntity, (data) => data.reservations, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  table: TableEntity;

  dtoClass = ReservationDto;
}
