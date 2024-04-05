import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsUrl, MinLength, Matches, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Full name of the admin',
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Unique username of the admin',
    example: 'johndoe123',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password of the admin',
    example: 'password123',
  })
  @IsString()
  // @MinLength(4)
  password: string;

  @ApiProperty({
    description: 'Confirm password of the admin',
    example: 'password123',
  })
  @IsString()
  // @MinLength(4)
  confirmPassword: string;

  @ApiProperty({
    description: 'Email address of the admin',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Telegram link of the admin',
    example: 'https://t.me/johndoe',
  })
  @IsUrl()
  tgLink: string;

  @IsNotEmpty()
  @IsPhoneNumber('UZ') // Format: +998907777777
  @ApiProperty({
    type: String,
    description: "User's phone number (Uzbekistan format)",
  })
  phone: string;
}
