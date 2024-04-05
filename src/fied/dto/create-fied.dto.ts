import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFiedDto {
  @ApiProperty({
    description: 'The name of the field',
    example: 'Field Name',
  })
  @IsString()
  name: string;
}
