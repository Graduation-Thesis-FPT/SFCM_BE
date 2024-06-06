import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_GATE')
export class Gate extends Model {
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
