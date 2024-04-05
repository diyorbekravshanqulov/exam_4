import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from '../../doctor/model/doctor.model';
import { Patient } from '../../patient/model/patient.model';
import { Payment } from '../../payment/model/payment.model';

interface IBookCreationAttr {
  doctorId: number;
  patientId: number;
  bookDate: string;
  bookedTime: number;
  paymentId: number;
}

@Table({ tableName: 'book' })
export class Book extends Model<Book, IBookCreationAttr> {
  @ApiProperty({ description: 'ID of the book', example: 1 })
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Doctor)
  @ApiProperty({ description: 'ID of the doctor', example: 1 })
  doctorId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => Patient)
  @ApiProperty({ description: 'ID of the patient', example: 1 })
  patientId: number;

  @Column({ type: DataType.DATE, defaultValue: Date.now(), allowNull: false })
  @ApiProperty({ description: 'Date of booking', example: '2022-04-01' })
  bookDate: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ApiProperty({ description: 'Booked time', example: 9 })
  bookedTime: number;

  @ForeignKey(() => Payment)
  @Column({ type: DataType.INTEGER, allowNull: false })
  @ApiProperty({ description: 'ID of the payment', example: 1 })
  paymentId: number;

  @BelongsTo(() => Doctor)
  doctor: Doctor;

  @BelongsTo(() => Patient)
  patient: Patient;

  @BelongsTo(() => Payment)
  payment: Payment;
}
