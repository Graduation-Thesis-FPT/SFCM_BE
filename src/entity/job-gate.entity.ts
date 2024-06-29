import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('JOB_GATE')
export class JobGateEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

  @Column()
  @IsNotEmpty()
  ORDER_NO: string;

  @Column()
  @IsNotEmpty()
  WAREHOUSE_CODE: string;

  @Column()
  @IsNotEmpty()
  GATE_CODE: string;

  @Column()
  @IsNotEmpty()
  IS_IN_OUT: string;

  @Column()
  DRIVER: string;

  @Column()
  TEL: string;

  @Column()
  TRUCK_NO: string;

  @Column()
  WEIGHT_REGIS: number;

  @Column()
  WEIGHT_REGIS_ALLOW: number;

  @Column()
  HOUSE_BILL: string;

  @Column()
  CARGO_PIECE: number;

  @Column()
  UNIT_CODE: string;

  @Column()
  NOTE: string;

  @Column()
  TIME_IN: Date;

  @Column()
  TIME_OUT: Date;

  @Column()
  IS_SUCCESS_IN: boolean;

  @Column()
  IS_SUCCESS_OUT: boolean;
}
