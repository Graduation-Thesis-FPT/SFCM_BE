import { IsDate, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import Model from './model.entity';

@Entity('SA_USER')
export class User extends Model {
  @Column()
  USER_NUMBER: string;

  @MaxLength(10, {
    message: 'USER_NAME have max length is 10 character',
  })
  @IsNotEmpty()
  @Column()
  USER_NAME: string;

  @Column()
  FULLNAME: string;

  @Column()
  PASSWORD: string;

  @IsEmail()
  @Column({
    unique: true,
  })
  EMAIL: string;

  @IsPhoneNumber('VN')
  @Column()
  TELEPHONE: string;

  @IsString()
  @Column()
  ADDRESS: string;

  @Column({ type: 'datetime' })
  @IsDate()
  BIRTHDAY: Date;

  @IsNotEmpty()
  @IsString()
  @Column()
  ROLE_CODE: string;

  @Column({ default: 1 })
  IS_ACTIVE: number;

  @Column()
  @IsString()
  REMARK: string;
}
