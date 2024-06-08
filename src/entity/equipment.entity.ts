import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_EQUIPMENTS')
export class Equipment extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  EQU_CODE: string;

  @Column()
  @IsNotEmpty()
  EQU_TYPE: string;

  @Column()
  @IsNotEmpty()
  EQU_CODE_NAME: string;

  @Column()
  @IsNotEmpty()
  REF_ROWGUID: string;

  @Column()
  @IsNotEmpty()
  BLOCK: string;
}
