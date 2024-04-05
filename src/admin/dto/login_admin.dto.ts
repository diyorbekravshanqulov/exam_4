import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({
    description: 'Email address of the admin',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the admin',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
