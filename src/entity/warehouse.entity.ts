import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_WAREHOUSE')
export class WareHouse extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  WAREHOUSE_CODE: string;

  @Column()
  @IsNotEmpty()
  WAREHOUSE_NAME: string;

  @Column()
  ACREAGE: number;

  @Column({ default: false })
  STATUS: boolean;
}
