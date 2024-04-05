import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Department } from '../../department/model/department.model';
import { Room } from '../../room/model/room.model';
import { Payment } from '../../payment/model/payment.model';
import { Book } from '../../book/model/book.model';
import { Doctor } from '../../doctor/model/doctor.model';

enum Gender {
  Male = 'Male',
  Female = 'Female',
}

interface PatientCreationAttr {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  hashedPassword: string;
  problem: string;
  age: number;
  gender: Gender;
  email: string;
}

@Table({ tableName: 'patient' })
export class Patient extends Model<Patient, PatientCreationAttr> {
  @ApiProperty({
    description: 'First name of the patient',
    example: 'John',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the patient',
    example: 'Doe',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @ApiProperty({
    description: 'Address of the patient',
    example: '123 Main Street',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @ApiProperty({
    description: 'Phone number of the patient',
    example: '+1234567890',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @ApiProperty({
    description: 'Problem description of the patient',
    example: 'Fever',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  problem: string;

  @ApiProperty({
    description: 'Hashed password of the patient',
  })
  @Column({
    type: DataType.STRING,
  })
  hashedPassword: string;

  @ApiProperty({
    description: 'Age of the patient',
    example: 30,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  age: number;

  @ApiProperty({
    description: 'Gender of the patient',
    enum: Gender,
    example: Gender.Male,
  })
  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    allowNull: false,
  })
  gender: Gender;

  @ApiProperty({
    description: 'Status of the patient',
    example: true,
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Email address of the patient',
    example: 'john@example.com',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @ApiProperty({
    description: 'Hashed refresh token of the admin',
  })
  @Column({
    type: DataType.STRING,
  })
  hashedRefreshToken: string;

  @ApiProperty({
    description: 'Activation link of the admin',
  })
  @Column({
    type: DataType.STRING,
  })
  activationLink: string;

  @BelongsToMany(() => Department, () => Room)
  department: Department[];

  @BelongsToMany(() => Payment, () => Book)
  payment: Payment[];

  @BelongsToMany(() => Doctor, () => Book)
  doctor: Doctor[];
}
