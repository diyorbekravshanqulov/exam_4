import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDoctorDto {
  @ApiProperty({
    description: 'Email address of the doctor',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the doctor',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
