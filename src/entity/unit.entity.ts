import {  Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_UNIT')
export class UnitType extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  UNIT_CODE: string;

  @Column()
  @IsNotEmpty()
  UNIT_NAME: string;

}
