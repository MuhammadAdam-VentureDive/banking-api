import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
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
    description: 'Rating (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Rating must be between 1 and 5' })
  @Max(5, { message: 'Rating must be between 1 and 5' })
  rating: number;

  @ApiProperty({
    description: 'Review title',
    example: 'Great service!',
    required: false,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Review content',
    example: 'I really enjoyed the service provided. Will use again.',
    required: false,
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Merchant name',
    example: 'ACME Store',
  })
  @IsNotEmpty()
  @IsString()
  merchantName: string;
} 