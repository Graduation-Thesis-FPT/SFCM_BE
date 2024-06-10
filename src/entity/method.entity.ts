import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_METHOD')
export class MethodEntity extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  METHOD_CODE: string;

  @Column()
  @IsNotEmpty()
  METHOD_NAME: string;

  @Column()
  IS_IN_OUT: string;

  @Column()
  IS_SERVICE: number;
}
