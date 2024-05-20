import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';

@Entity('SA_PERMISSION')
export class Permission extends Model {
  @Column('uuid')
  ROWGUID: string;

  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  ROLE_CODE: string;

  @Column()
  @IsNotEmpty()
  MENU_CODE: string;

  @Column()
  IS_VIEW: boolean;

  @Column()
  IS_ADD_NEW: boolean;

  @Column()
  IS_MODIFY: boolean;

  @Column()
  IS_DELETE: boolean;
}
