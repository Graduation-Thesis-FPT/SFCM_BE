import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('DELIVERY_ORDER_DETAIL')
export class DeliveryOrderDtlEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

  @Column()
  @IsNotEmpty()
  DE_ORDER_NO: string;

  @Column()
  METHOD_CODE: string;

  @Column()
  HOUSE_BILL: string;

  @Column()
  CBM: number;

  @Column()
  LOT_NO: number;

  @Column()
  QUANTITY_CHK: boolean;

  @Column()
  REF_PAKAGE: string;
}
