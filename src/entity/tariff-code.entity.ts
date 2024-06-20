import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('TRF_CODES')
export class TariffCodeEntity extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  TRF_CODE: string;

  @Column()
  @IsNotEmpty()
  TRF_DESC: string;
}
