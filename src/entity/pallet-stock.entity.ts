import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('DT_PALLET_STOCK')
export class PalletStockEntity extends BaseModel {
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

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  PALLET_LENGTH: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  PALLET_WIDTH: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  PALLET_HEIGHT: number;

  @Column()
  NOTE: string;
  PACKAGE_ID: any;
}
