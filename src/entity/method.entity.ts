import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_WAREHOUSE')
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
  IS_SERVICE : number;

  @BeforeInsert()
  @BeforeUpdate()
  trimString() {
    this.METHOD_CODE = this.METHOD_CODE.trim();
    this.METHOD_NAME = this.METHOD_NAME.trim();
  }
}
