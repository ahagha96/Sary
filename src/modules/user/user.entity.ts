import { Column, Entity, Index } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UserRole } from '../../constants';
import { UserDto } from './user.dto';

@Entity({ name: 't_user' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ nullable: false, unique: true, length: 4 })
  @Index('idx_employee_number')
  employeeNumber: string;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  dtoClass = UserDto;
}
