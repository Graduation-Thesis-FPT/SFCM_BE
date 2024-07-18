import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity';

@Entity('SA_ROLE')
export class Role extends Model {
  @Column('uuid')
  ROWGUID: string;

  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  ROLE_CODE: string;

  @Column()
  @IsNotEmpty()
  ROLE_NAME: string;

  @OneToMany(() => User, user => user.ROLE)
  USERS: User[];
}
