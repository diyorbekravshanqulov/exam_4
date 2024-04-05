import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsEmail,
} from 'class-validator';

enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export class CreatePatientDto {
  @ApiProperty({
    description: 'First name of the patient',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the patient',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Password for the patient',
    example: 'Password123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Confirmation of the password',
    example: 'Password123',
  })
  @IsString()
  comfirmPassword: string;

  @ApiProperty({
    description: 'Address of the patient',
    example: '123 Main Street',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Phone number of the patient',
    example: '+1234567890',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Problem description of the patient',
    example: 'Fever',
  })
  @IsString()
  problem: string;

  @ApiProperty({
    description: 'Age of the patient',
    example: 30,
  })
  @IsNumber()
  age: number;

  @ApiProperty({
    description: 'Gender of the patient',
    enum: Gender,
    example: Gender.Male,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Email address of the patient',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;
}
