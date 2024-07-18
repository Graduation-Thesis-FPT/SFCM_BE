import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('INV_DFT')
export class InvDftEntity extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  DRAFT_INV_NO: string;

  @Column()
  INV_NO: Date;

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
