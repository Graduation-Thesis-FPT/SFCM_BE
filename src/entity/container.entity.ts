import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('DT_CNTR_MNF_LD')
export class ContainerEntity extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

  @Column()
  @IsNotEmpty()
  VOYAGEKEY: string;

  @Column()
  BILLOFLADING: string;

  @Column()
  SEALNO: string;

  @Column()
  @IsNotEmpty()
  CNTRNO: string;

  @Column()
  @IsNotEmpty()
  CNTRSZTP: string;

  @Column()
  @IsNotEmpty()
  STATUSOFGOOD: boolean;

  @Column()
  @IsNotEmpty()
  ITEM_TYPE_CODE: string;

  @Column()
  COMMODITYDESCRIPTION: string;

  @Column()
  @IsNotEmpty()
  CONSIGNEE: string;
}
