import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The price of the payment',
    example: 100.0,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The type of payment (e.g., credit card, cash)',
    example: 'credit card',
  })
  @IsString()
  paymentType: string;
}
