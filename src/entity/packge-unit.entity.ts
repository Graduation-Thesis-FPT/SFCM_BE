import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('BS_PACKAGE_UNIT')
export class PackageUnit extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  PACKAGE_UNIT_CODE: string;

  @Column()
  @IsNotEmpty()
  PACKAGE_UNIT_NAME: string;
}
