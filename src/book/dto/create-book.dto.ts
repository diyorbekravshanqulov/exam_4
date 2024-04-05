import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDate, IsPositive, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ description: 'ID of the doctor', example: 1 })
  @IsNumber()
  @IsPositive()
  doctorId: number;

  @ApiProperty({ description: 'ID of the patient', example: 1 })
  @IsNumber()
  @IsPositive()
  patientId: number;

  @ApiProperty({ description: 'Date of booking', example: '2022-04-01' })
  @IsString()
  bookDate: string;

  @ApiProperty({ description: 'Booked time', example: 9 })
  @IsNumber()
  @IsPositive()
  bookedTime: number;

  @ApiProperty({ description: 'ID of the payment', example: 1 })
  @IsNumber()
  @IsPositive()
  paymentId: number;
}
