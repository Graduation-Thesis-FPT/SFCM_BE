import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('TRF_DIS')
export class DiscountTariffEntity extends Model {
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  ROWGUID: string;

  @Column()
  @IsNotEmpty()
  ITEM_TYPE_CODE: string;

  @Column()
  @IsNotEmpty()
  METHOD_CODE: string;

  @Column()
  @IsNotEmpty()
  CUSTOMER_CODE: string;

  @Column()
  @IsNotEmpty()
  TRF_TEMP_CODE: string;

  @Column()
  @IsNotEmpty()
  TRF_CODE: string;

  @Column()
  TRF_DESC: string;

  @Column()
  AMT_CBM: number;

  @Column()
  VAT: number;

  @Column()
  INCLUDE_VAT: boolean;
}
