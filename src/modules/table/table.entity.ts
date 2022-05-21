import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { ReservationEntity } from '../reservation/reservation.entity';
import { TableDto } from './table.dto';

@Entity({ name: 't_table' })
export class TableEntity extends AbstractEntity<TableDto> {
  @Column({ nullable: false, unique: true })
  number: string;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 0 })
  numberOfSeats: number;

  @OneToMany(() => ReservationEntity, (data) => data.table, {
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  reservations: ReservationEntity[];

  dtoClass = TableDto;
}
