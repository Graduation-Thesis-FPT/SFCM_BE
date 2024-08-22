import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('DT_PACKAGE_MNF_LD')
export class Package extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  ROWGUID: string;

  @IsNotEmpty()
  @Column()
  PACKAGE_UNIT_CODE: string;

  @IsNotEmpty()
  @Column()
  ITEM_TYPE_CODE: string;

  @IsNotEmpty()
  @Column()
  CONTAINER_ID: string;

  @IsNotEmpty()
  @Column()
  HOUSE_BILL: string;

  @Column()
  CARGO_PIECE: number;

  @IsNotEmpty()
  @Column({ type: 'float' })
  CBM: number;

  @IsNotEmpty()
  @Column()
  DECLARE_NO: string;

  @Column()
  NOTE: string;

  @Column()
  JOB_TYPE: string;

  @Column()
  TIME_IN: Date;

  @Column()
  TIME_OUT: Date;
}
