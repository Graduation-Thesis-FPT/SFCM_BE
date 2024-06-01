import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_WAREHOUSE')
export class WareHouse extends Model {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

  @Column()
  @IsNotEmpty()
  WAREHOUSE_CODE: string;

  @Column()
  @IsNotEmpty()
  WAREHOUSE_NAME: string;

  @Column()
  ACREAGE: number;

  @Column({ default: false })
  STATUS: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  trimString() {
    this.WAREHOUSE_CODE = this.WAREHOUSE_CODE.trim();
    this.WAREHOUSE_NAME = this.WAREHOUSE_NAME.trim();
  }
}
