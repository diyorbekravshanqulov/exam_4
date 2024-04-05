import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from '../../doctor/model/doctor.model';
import { Patient } from '../../patient/model/patient.model';
import { Room } from '../../room/model/room.model';

interface DepartmentCreationAttr {
  name: string;
  doctorId: number;
}

@Table({ tableName: 'department' })
export class Department extends Model<Department, DepartmentCreationAttr> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty({ description: 'Name of the department', example: 'Cardiology' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({
    description: 'ID of the doctor associated with the department',
    example: 1,
  })
  @ForeignKey(() => Doctor)
  @Column({ type: DataType.INTEGER, allowNull: false })
  doctorId: number;

  @BelongsTo(() => Doctor)
  doctor: Doctor;

  @BelongsToMany(() => Patient, () => Room)
  patient: Patient[];
}
