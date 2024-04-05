import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateFiedDto {
  @ApiProperty({
    description: 'The name of the field',
    example: 'Updated Field Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
