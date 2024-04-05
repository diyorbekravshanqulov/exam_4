import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsEmail,
  IsOptional,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export class UpdatePatientDto {
  @ApiProperty({
    description: 'First name of the patient',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the patient',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Password for the patient',
    example: 'Password123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'Confirmation of the password',
    example: 'Password123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  confirmPassword?: string;

  @ApiProperty({
    description: 'Address of the patient',
    example: '123 Main Street',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Phone number of the patient',
    example: '+998933757262',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiProperty({
    description: 'Problem description of the patient',
    example: 'Fever',
    required: false,
  })
  @IsOptional()
  @IsString()
  problem?: string;

  @ApiProperty({
    description: 'Age of the patient',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({
    description: 'Gender of the patient',
    enum: Gender,
    example: Gender.Male,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    description: 'Email address of the patient',
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
