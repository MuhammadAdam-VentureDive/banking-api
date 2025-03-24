import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({
    description: 'User ID',
    example: '54404291-c4ec-48b1-8481-b4d4205fd510',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Checkout amount',
    example: 100.00,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Merchant name',
    example: 'ACME Store',
  })
  @IsNotEmpty()
  @IsString()
  merchantName: string;

  @ApiProperty({
    description: 'Merchant ID',
    example: 'MERCH-123456',
  })
  @IsNotEmpty()
  @IsString()
  merchantId: string;
} 