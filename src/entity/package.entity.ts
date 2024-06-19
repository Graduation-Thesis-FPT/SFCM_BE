import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('DT_PACKAGE_MNF_LD')
export class Package extends Model {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

  @Column()
  HOUSE_BILL: string;

  @Column()
  LOT_NO: string;

  @Column()
  ITEM_TYPE_CODE: string;

  @Column()
  UNIT_CODE: string;

  @Column()
  CARGO_PIECE: number;

  @Column()
  CBM: number;

  @Column()
  DECLARE_NO: string;

  @Column()
  NOTE: string;

  @Column()
  REF_CONTAINER: string;
}
