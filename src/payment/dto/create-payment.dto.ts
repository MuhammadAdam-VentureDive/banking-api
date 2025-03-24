import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'User ID',
    example: '54404291-c4ec-48b1-8481-b4d4205fd510',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Checkout ID',
    example: 'f87c5d9a-3f25-4f83-98b5-1234567890ab',
  })
  @IsNotEmpty()
  @IsUUID()
  checkoutId: string;

  @ApiProperty({
    description: 'QR code data for payment processing',
    example: 'PAY-CHECKOUT-12345-AMOUNT-100.00',
  })
  @IsNotEmpty()
  @IsString()
  qrCodeData: string;
} 