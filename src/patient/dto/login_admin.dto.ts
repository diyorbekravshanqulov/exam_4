import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginPatientDto {
  @ApiProperty({
    description: 'Email address of the patient',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the patient',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
