import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class PaymentPendingDto {
  @ApiProperty({
    description: 'User ID',
    example: '54404291-c4ec-48b1-8481-b4d4205fd510',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Payment ID',
    example: 'a8b9c7d6-1111-4444-abcd-123456789abc',
  })
  @IsNotEmpty()
  @IsUUID()
  paymentId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 100.00,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;
} 