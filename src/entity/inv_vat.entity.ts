import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('INV_VAT')
export class InvNoEntity extends BaseModel {
  @PrimaryColumn()
  @IsNotEmpty()
  INV_NO: string;

  @Column()
  INV_DATE: Date;

  @Column()
  PAYER: string;

  @Column()
  AMOUNT: number;

  @Column()
  VAT: number;

  @Column()
  TAMOUNT: number;

  @Column()
  PAYMENT_STATUS: string;

  @Column()
  ACC_CD: string;

  @Column()
  CANCEL_DATE: Date;

  @Column()
  CANCLE_REMARK: string;
}
