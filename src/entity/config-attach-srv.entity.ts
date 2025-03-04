import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('CONFIG_ATTACH_SRV')
export class ConfigAttachSrvEntity extends BaseModel {
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  ROWGUID: string;

  @Column()
  @IsNotEmpty()
  METHOD_CODE: string;

  @Column()
  @IsNotEmpty()
  ATTACH_SERVICE_CODE: string;
}
