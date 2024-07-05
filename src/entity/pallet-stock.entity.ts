import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('DT_PALLET_STOCK')
export class PalletStockEntity extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  PALLET_NO: string;

  @IsNotEmpty()
  @Column()
  JOB_QUANTITY_ID: string;

  @Column()
  CELL_ID: string;

  @Column()
  PALLET_STATUS: string;

  @Column()
  PALLET_LENGTH: number;

  @Column()
  PALLET_WIDTH: number;

  @Column()
  PALLET_HEIGHT: number;

  @Column()
  NOTE: string;
}
