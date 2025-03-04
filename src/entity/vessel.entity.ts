import { Column, Entity, PrimaryColumn } from 'typeorm';
import BaseModel from './model.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('DT_VESSEL_VISIT')
export class Vessel extends BaseModel {
  @PrimaryColumn()
  VOYAGEKEY: string;

  @Column()
  @IsNotEmpty()
  VESSEL_NAME: string;

  @Column()
  INBOUND_VOYAGE: string;

  @Column()
  ETA: Date;

  @Column()
  CallSign: string;

  @Column()
  IMO: string;
}
