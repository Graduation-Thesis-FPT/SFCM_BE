import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('JOB_QUANTITY_CHECK')
export class JobQuantityCheckEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  ROWGUID: string;

  @Column()
  PACKAGE_ID: string;

  @Column()
  ESTIMATED_CARGO_PIECE: number;

  @Column()
  ACTUAL_CARGO_PIECE: number;

  @Column()
  SEQ: number;

  @Column()
  START_DATE: Date;

  @Column()
  FINISH_DATE: Date;

  @Column()
  JOB_STATUS: string;

  @Column()
  NOTE: string;
}
