import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('DT_ORDER')
export class OrderEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  ORDER_NO: string;

  @Column()
  CUSTOMER_CODE: string;

  @Column()
  ACC_TYPE: string;

  @Column()
  DELIVERY_ORDER: string;

  @Column()
  BILLOFLADING: string;

  @Column()
  REF_CONTAINER: string;

  @Column()
  ITEM_TYPE_CODE: string;

  @Column()
  @IsNotEmpty()
  ITEM_TYPE_CODE_CNTR: number;

  @Column()
  @IsNotEmpty()
  METHOD_CODE: string;

  @Column()
  @IsNotEmpty()
  ISSUE_DATE: Date;

  @Column()
  @IsNotEmpty()
  EXP_DATE: Date;

  @Column()
  TOTAL_CBM: number;

  @Column()
  HOUSE_BILL: string;

  @Column()
  NOTE: string;

  @Column()
  DRAFT_NO: string;

  @Column()
  INV_NO: string;

  @Column()
  @IsNotEmpty()
  GATE_CHK: boolean;

  @Column()
  COMMODITYDESCRIPTION: string;
}
