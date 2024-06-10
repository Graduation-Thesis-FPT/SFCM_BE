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
  TIER_COUNT: number;

  @Column()
  SLOT_COUNT: number;

  @Column()
  BLOCK_WIDTH: number;

  @Column()
  BLOCK_HEIGHT: number;

  @Column({ default: false })
  STATUS: boolean;
}
