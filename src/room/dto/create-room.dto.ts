import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'Room number', example: 101 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  roomNumber: number;

  @ApiProperty({ description: 'ID of the patient occupying the room', example: 1 })
  @IsInt()
  @IsPositive()
  patientId: number;

  @ApiProperty({ description: 'ID of the department the room belongs to', example: 1 })
  @IsInt()
  @IsPositive()
  departemenId: number;
}
