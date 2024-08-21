import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('TRF_STD')
export class TariffEntity extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  ROWGUID: string;

  @Column()
  @IsNotEmpty()
  TRF_CODE: string;

  @Column()
  @IsNotEmpty()
  TRF_DESC: string;

  @Column()
  @IsNotEmpty()
  METHOD_CODE: string;

  @Column()
  @IsNotEmpty()
  ITEM_TYPE_CODE: string;

  @Column()
  @IsNotEmpty()
  AMT_CBM: number;

  @Column()
  VAT: number;

  @Column()
  INCLUDE_VAT: boolean;

  @IsNotEmpty()
  @Column()
  TRF_TEMP_CODE: string;
}
