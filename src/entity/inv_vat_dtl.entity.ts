import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('INV_VAT_DTL')
export class InvNoDtlEntity extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  ROWGUID: string;

  @Column()
  INV_ID: string;

  @Column()
  QTY: number;

  @Column()
  UNIT_RATE: number;

  @Column()
  AMOUNT: number;

  @Column()
  VAT: number;

  @Column()
  VAT_RATE: number;

  @Column()
  TAMOUNT: number;

  @Column()
  CARGO_TYPE: string;

  @Column()
  TRF_DESC: string;
}
