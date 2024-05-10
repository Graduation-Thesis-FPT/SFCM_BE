import { IsString } from 'class-validator';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
} from 'typeorm';

export default abstract class Model extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

  @IsString()
  @Column()
  CREATE_BY: string;

  @CreateDateColumn({ type: 'datetime' })
  CREATE_DATE: Date;

  @Column()
  UPDATE_BY: string;

  @UpdateDateColumn({ type: 'datetime' })
  UPDATE_DATE: Date;
}
