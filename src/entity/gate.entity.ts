import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_GATE')
export class Gate extends BaseModel {
  @PrimaryColumn()
  @IsNotEmpty()
  GATE_CODE: string;

  @Column()
  @IsNotEmpty()
  GATE_NAME: string;

  @Column()
  @IsNotEmpty()
  IS_IN_OUT: string;
}
