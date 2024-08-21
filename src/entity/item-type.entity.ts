import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_ITEM_TYPE')
export class ItemType extends BaseModel {
  @PrimaryColumn()
  @IsNotEmpty()
  ITEM_TYPE_CODE: string;

  @Column()
  @IsNotEmpty()
  ITEM_TYPE_NAME: string;
}
