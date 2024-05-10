import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import Model from './model.entity';

@Entity('SA_USER')
export class User extends Model {
  @IsOptional()
  @Column({ nullable: true })
  USER_NUMBER: string;

  @MaxLength(15, {
    message: 'USER_NAME have max length is 10 character',
  })
  @IsNotEmpty()
  @Column()
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
  @Column({ nullable: true })
  @IsDate()
  BIRTHDAY: Date;

  @IsNotEmpty()
  @IsString()
  @Column()
  ROLE_CODE: string;

  @IsOptional()
  @Column({ default: 1, nullable: true })
  IS_ACTIVE: number;

  @IsOptional()
  @Column({ nullable: true })
  @IsString()
  REMARK: string;
}
