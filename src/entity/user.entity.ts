import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Model from './model.entity';
import { Role } from './role.entity';

@Entity('SA_USER')
export class User extends Model {
  @PrimaryGeneratedColumn('uuid')
  ROWGUID: string;

  @MaxLength(15, {
    message: 'USER_NAME have max length is 10 character',
  })
  @Column()
  @IsNotEmpty()
  USER_NAME: string;

  @IsOptional()
  @Column({ nullable: true })
  FULLNAME: string;

  @IsOptional()
  @Column({ select: false, nullable: true })
  PASSWORD: string;

  @IsOptional()
  @IsEmail()
  @Column({
    nullable: true,
  })
  EMAIL: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  @Column({ nullable: true })
  TELEPHONE: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  ADDRESS: string;

  @IsOptional()
  @Column({ type: 'datetime' })
  @IsDate()
  BIRTHDAY: Date;

  @IsNotEmpty()
  @IsString()
  @Column()
  ROLE_CODE: string;

  @IsOptional()
  @Column({ default: true })
  IS_ACTIVE: boolean;

  @IsOptional()
  @Column({ nullable: true })
  @IsString()
  REMARK: string;

  @ManyToOne(() => Role, role => role.user)
  @JoinColumn({ name: 'ROLE_CODE' })
  role: Role;
}
