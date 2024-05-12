import { IsOptional, IsString } from 'class-validator';
import moment from 'moment';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  AfterLoad,
} from 'typeorm';

export default abstract class Model extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

  @IsString()
  @Column()
  CREATE_BY: string;

  @CreateDateColumn({ type: 'datetime' })
  @IsOptional()
  CREATE_DATE: Date;

  @Column()
  UPDATE_BY: string;

  @IsOptional()
  @UpdateDateColumn({ type: 'datetime', nullable: true  })
  UPDATE_DATE: Date;
  
  @AfterLoad()
  updateDates() {
    const updateDate = moment(this.UPDATE_DATE).format('DD/MM/YYYY HH:mm');
    return this.UPDATE_DATE = updateDate as any;
  }

  @AfterLoad()
  createDates() {
    const createDate = moment(this.CREATE_DATE).format('DD/MM/YYYY HH:mm');
    return this.CREATE_DATE = createDate as any;
  }
}
