import { IsOptional, IsString } from 'class-validator';
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
  @IsOptional()
  CREATE_DATE: Date;

  @Column()
  UPDATE_BY: string;

  @IsOptional()
  @UpdateDateColumn({ type: 'datetime', nullable: true  })
  UPDATE_DATE: Date;
}
