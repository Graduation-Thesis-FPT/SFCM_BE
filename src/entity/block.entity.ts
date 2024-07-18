import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_BLOCK')
export class Block extends Model {
  @PrimaryColumn()
  BLOCK_CODE: string;

  @Column()
  @IsNotEmpty()
  WAREHOUSE_CODE: string;

  @Column()
  @IsNotEmpty()
  BLOCK_NAME: string;

  @Column()
  TIER_COUNT: number;

  @Column()
  SLOT_COUNT: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  BLOCK_WIDTH: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  BLOCK_HEIGHT: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  BLOCK_LENGTH: number;
}
