import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Patient } from '../../patient/model/patient.model';
import { Book } from '../../book/model/book.model';
import { Doctor } from '../../doctor/model/doctor.model';

interface PaymentCreationAttr {
  price: number;
  paymentType: string;
}

@Table({ tableName: 'payment' })
export class Payment extends Model<Payment, PaymentCreationAttr> {
  @ApiProperty({
    description: 'Payment ID',
    required: false,
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    description: 'The price of the payment',
    example: 100.0,
  })
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @ApiProperty({
    description: 'The type of payment (e.g., credit card, cash)',
    example: 'credit card',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  paymentType: string;

  @BelongsToMany(() => Patient, () => Book)
  patient: Patient[];

  @BelongsToMany(() => Doctor, () => Book)
  doctor: Doctor[];
}
