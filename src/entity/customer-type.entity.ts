import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_CUSTOMER_TYPE')
export class CustomerType extends BaseModel {
  @PrimaryColumn()
  CUSTOMER_TYPE_CODE: string;

  @Column()
  @IsNotEmpty()
  CUSTOMER_TYPE_NAME: string;
}
