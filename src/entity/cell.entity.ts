import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_CELL')
export class Cell extends Model {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

  @Column()
  @IsNotEmpty()
  BLOCK_CODE: string;

  @Column()
  TIER_ORDERED: number;

  @Column()
  SLOT_ORDERED: number;

  @Column({ default: 0 })
  STATUS: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  CELL_LENGTH: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  CELL_WIDTH: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  CELL_HEIGHT: number;
}
