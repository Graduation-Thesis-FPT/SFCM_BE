import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_BLOCK')
export class Block extends Model {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

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

  @Column()
  BLOCK_WIDTH: number;

  @Column()
  BLOCK_HEIGH: number;

  @Column()
  STATUS: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  trimString() {
    this.WAREHOUSE_CODE = this.WAREHOUSE_CODE.trim();
    this.BLOCK_NAME = this.BLOCK_NAME.trim();
  }
}
