import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_CUSTOMER')
export class Customer extends BaseModel {
  @PrimaryColumn()
  CUSTOMER_CODE: string;

  @Column()
  @IsNotEmpty()
  CUSTOMER_TYPE_CODE: string;

  @Column()
  @IsNotEmpty()
  CUSTOMER_NAME: string;

  @Column()
  ADDRESS: string;

  @Column()
  @IsNotEmpty()
  TAX_CODE: string;

  @Column()
  EMAIL: string;

  @Column()
  @IsNotEmpty()
  IS_ACTIVE: boolean;

  @Column()
  @IsNotEmpty()
  USER_NAME: string;
}
