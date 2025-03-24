import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    description: 'Email address to send the confirmation to (optional)',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Custom message to include in the email (optional)',
    example: 'Thank you for your feedback!',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
} 