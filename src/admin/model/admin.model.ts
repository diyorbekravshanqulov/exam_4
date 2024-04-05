import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface AdminCreationAttr {
  fullName: string;
  username: string;
  hashedPassword: string;
  email: string;
  tgLink: string;
  phone: string;
}

@Table({ tableName: 'admin' })
export class Admin extends Model<Admin, AdminCreationAttr> {
  @ApiProperty({
    description: 'Admin ID',
    required: false,
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    description: 'Full name of the admin',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @ApiProperty({
    description: 'Unique username of the admin',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    // unique: true,
  })
  username: string;

  @ApiProperty({
    description: 'Hashed password of the admin',
  })
  @Column({
    type: DataType.STRING,
  })
  hashedPassword: string;

  @ApiProperty({
    description: 'Email address of the admin',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    // unique: true,
  })
  email: string;

  @ApiProperty({
    description: 'Telegram link of the admin',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tgLink: string;

  @ApiProperty({
    description: 'Phone number of the admin',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @ApiProperty({
    description: 'Flag indicating if the admin is active',
    default: false,
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Flag indicating if the admin is creator',
    default: false,
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isCreator: boolean;

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
  length: number;
}
