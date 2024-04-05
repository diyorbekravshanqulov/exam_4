import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsUrl, Matches } from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({
    description: 'Full name of the admin',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    description: 'Unique username of the admin',
    example: 'johndoe123',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Email address of the admin',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Telegram link of the admin',
    example: 'https://t.me/johndoe',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  tgLink?: string;

  @ApiProperty({
    description: 'Phone number of the admin',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+\d{6,15}$/)
  phone?: string;
}
