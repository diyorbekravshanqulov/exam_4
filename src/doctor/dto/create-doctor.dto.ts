import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
enum WorkDay {
  Monday = 'Monday',
  Wednesday = 'Wednesday',
  Friday = 'Friday',
} // Assuming you have an enum for work days

export class CreateDoctorDto {
  @ApiProperty({ description: 'First name of the doctor', example: 'John' })
  @IsString()
  @Length(1, 255)
  firstName: string;

  @ApiProperty({ description: 'Last name of the doctor', example: 'Doe' })
  @IsString()
  @Length(1, 255)
  lastName: string;

  @ApiProperty({
    description: 'Phone number of the doctor',
    example: '+1234567890',
  })
  @IsString()
  @Length(10, 15)
  phone: string;

  @ApiProperty({
    description: 'Password for the doctor account',
    example: 'password123',
  })
  @IsString()
  @Length(6, 255)
  password: string;

  @ApiProperty({
    description: 'Confirm password for the doctor account',
    example: 'password123',
  })
  @IsString()
  @Length(6, 255)
  confirmPassword: string;

  @ApiProperty({ description: 'Years of experience of the doctor', example: 5 })
  @IsNumber()
  @IsPositive()
  experience: number;

  @ApiProperty({
    description: 'ID of the field the doctor belongs to',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  fieldId: number;

  @ApiProperty({
    description: 'Work day of the doctor',
    enum: WorkDay,
    example: WorkDay.Monday,
  })
  @IsEnum(WorkDay)
  wordDay: WorkDay;

  @ApiProperty({
    description: 'Email of the doctor',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 255)
  email: string;
}
