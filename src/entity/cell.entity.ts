import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_CELL')
export class Cell extends Model {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

  @Column()
  @IsNotEmpty()
  WAREHOUSE_CODE: string;

  @Column()
  @IsNotEmpty()
  BLOCK_CODE: string;

  @Column()
  TIER_ORDERED: number;

  @Column()
  SLOT_ORDERED: number;

  @Column({ default: 0 })
  STATUS: number;

  @Column()
  CELL_LENGTH: number;

  @Column()
  CELL_WIDTH: number;

  @Column()
  CELL_HEIGHT: number;
}
