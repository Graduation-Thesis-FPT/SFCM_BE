import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_METHOD')
export class MethodEntity extends BaseModel {
  @PrimaryColumn()
  @IsNotEmpty()
  METHOD_CODE: string;

  @Column()
  @IsNotEmpty()
  METHOD_NAME: string;

  @Column()
  IS_IN_OUT: string;

  @Column()
  IS_SERVICE: boolean;
}
