import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('TRF_CODES')
export class TariffCodeEntity extends BaseModel {
  @PrimaryColumn()
  @IsNotEmpty()
  TRF_CODE: string;

  @Column()
  @IsNotEmpty()
  TRF_DESC: string;
}
