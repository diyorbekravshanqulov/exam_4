import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface FieldCreationAttr {
  name: string;
}

@Table({ tableName: 'field' })
export class Field extends Model<Field, FieldCreationAttr> {
  @ApiProperty({
    description: 'Field ID',
    required: false,
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the field',
    example: 'Field Name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
