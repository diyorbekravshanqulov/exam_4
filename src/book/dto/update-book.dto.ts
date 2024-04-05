import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDate, IsPositive, IsString } from 'class-validator';

export class UpdateBookDto {
  @ApiProperty({ description: 'ID of the doctor', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  doctorId?: number;

  @ApiProperty({
    description: 'ID of the patient',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  patientId?: number;

  @ApiProperty({
    description: 'Date of booking',
    example: '2022-04-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  bookDate?: string;

  @ApiProperty({ description: 'Booked time', example: 9, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  bookedTime?: number;

  @ApiProperty({
    description: 'ID of the payment',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  paymentId?: number;
}
