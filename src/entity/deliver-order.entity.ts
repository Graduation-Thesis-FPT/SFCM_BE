import { Column, Entity, PrimaryColumn } from 'typeorm';
import Model from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('DELIVER_ORDER')
export class DeliverOrderEntity extends Model {
  @PrimaryColumn()
  @IsNotEmpty()
  DE_ORDER_NO: string;

  @Column()
  @IsNotEmpty()
  CUSTOMER_CODE: string;

  @Column()
  CONTAINER_ID: string;

  @Column()
  PACKAGE_ID: string;

  @Column()
  INV_ID: string;

  @Column()
  INV_DRAFT_ID: string;

  @Column()
  @IsNotEmpty()
  ISSUE_DATE: Date;

  @Column()
  @IsNotEmpty()
  EXP_DATE: Date;

  @Column()
  TOTAL_CBM: number;

  @Column()
  JOB_CHK: boolean;

  @Column()
  NOTE: string;

  @Column()
  IS_VALID: boolean;
}
