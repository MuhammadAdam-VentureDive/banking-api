import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendReceiptEmailDto {
  @ApiProperty({
    description: 'Email address to send the receipt to (optional)',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Custom subject for the email (optional)',
    example: 'Your Receipt from ACME Store',
    required: false,
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    description: 'Custom message to include in the email (optional)',
    example: 'Thank you for your purchase! Here is your receipt.',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
} 