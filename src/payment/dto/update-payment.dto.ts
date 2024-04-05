import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'The price of the payment',
    example: 100.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'The type of payment (e.g., credit card, cash)',
    example: 'credit card',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentType?: string;
}
