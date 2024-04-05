import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsOptional } from 'class-validator';

export class UpdateRoomDto {
  @ApiPropertyOptional({ description: 'Room number', example: 101 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  roomNumber?: number;

  @ApiPropertyOptional({
    description: 'ID of the patient occupying the room',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  patientId?: number;

  @ApiPropertyOptional({
    description: 'ID of the department the room belongs to',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  departemenId?: number;
}
