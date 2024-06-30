import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('TRF_TEMP')
export class TariffTempEntity extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  TRF_TEMP_CODE: string;

  @Column()
  @IsNotEmpty()
  TRF_TEMP_NAME: string;

  @Column()
  @IsNotEmpty()
  FROM_DATE: Date;

  @Column()
  @IsNotEmpty()
  TO_DATE: Date;
}
