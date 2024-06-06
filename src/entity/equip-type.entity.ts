import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_EQUIPMENTS_TYPE')
export class EquipType extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  EQU_TYPE: string;

  @Column()
  @IsNotEmpty()
  EQU_TYPE_NAME: string;
}
