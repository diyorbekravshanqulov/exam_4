import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Patient } from '../../patient/model/patient.model';
import { Department } from '../../department/model/department.model';

interface IRoomCreationAttr {
  roomNumber: number;
  patientId: number;
  departemenId: number;
}

@Table({ tableName: 'room' })
export class Room extends Model<Room, IRoomCreationAttr> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  @ApiProperty({ description: 'The unique identifier of the room', example: 1 })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ApiProperty({ description: 'Room number', example: 101 })
  roomNumber: number;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiProperty({
    description: 'ID of the patient occupying the room',
    example: 1,
  })
  patientId: number;

  @ForeignKey(() => Department)
  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiProperty({
    description: 'ID of the department the room belongs to',
    example: 1,
  })
  departemenId: number;
}
