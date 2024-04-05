import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Field } from '../../fied/model/fied.model';
import { Patient } from '../../patient/model/patient.model';
import { Book } from '../../book/model/book.model';
import { Payment } from '../../payment/model/payment.model';

// Enum representing the available work days for doctors
enum WorkDay {
  Monday = 'Monday',
  Wednesday = 'Wednesday',
  Friday = 'Friday',
}

// Interface representing the attributes required to create a Doctor
interface IDoctorCreationAttr {
  firstName: string;
  lastName: string;
  phone: string;
  experience: number;
  hashedPassword: string;
  fieldId: number;
  wordDay: WorkDay;
  email: string;
}

@Table({ tableName: 'doctor' })
export class Doctor extends Model<Doctor, IDoctorCreationAttr> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty({ description: 'First name of the doctor' })
  @Column({ type: DataType.STRING })
  firstName: string;

  @ApiProperty({ description: 'Last name of the doctor' })
  @Column({ type: DataType.STRING })
  lastName: string;

  @ApiProperty({ description: 'Phone number of the doctor' })
  @Column({ type: DataType.STRING })
  phone: string;

  @ApiProperty({ description: 'Years of experience of the doctor' })
  @Column({ type: DataType.INTEGER })
  experience: number;

  @ForeignKey(() => Field)
  @ApiProperty({ description: 'ID of the field the doctor belongs to' })
  @Column({ type: DataType.INTEGER })
  fieldId: number;

  @ApiProperty({ description: 'Work day of the doctor', enum: WorkDay })
  @Column({ type: DataType.ENUM(...Object.values(WorkDay)) })
  wordDay: WorkDay;

  @ApiProperty({ description: 'Email of the doctor' })
  @Column({ type: DataType.STRING })
  email: string;

  @ApiProperty({
    description: 'Hashed password of the patient',
  })
  @Column({
    type: DataType.STRING,
  })
  hashedPassword: string;

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

  @BelongsTo(() => Field)
  field: Field;

  @BelongsToMany(() => Patient, () => Book)
  patient: Patient[];

  @BelongsToMany(() => Payment, () => Book)
  payment: Payment[];
}
