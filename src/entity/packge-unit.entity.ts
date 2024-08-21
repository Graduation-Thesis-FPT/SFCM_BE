import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_PACKAGE_UNIT')
export class PackageUnit extends BaseModel {
  @PrimaryColumn()
  @IsNotEmpty()
  PACKAGE_UNIT_CODE: string;

  @Column()
  @IsNotEmpty()
  PACKAGE_UNIT_NAME: string;
}
