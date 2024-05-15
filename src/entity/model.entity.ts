import { IsNotEmpty } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn, BaseEntity, Column } from 'typeorm';

export default abstract class Model extends BaseEntity {
  @Column()
  @IsNotEmpty()
  CREATE_BY: string;

  @CreateDateColumn({ type: 'datetime' })
  CREATE_DATE: Date;

  @Column()
  @IsNotEmpty()
  UPDATE_BY: string;

  @UpdateDateColumn({ type: 'datetime' })
  UPDATE_DATE: Date;
}
