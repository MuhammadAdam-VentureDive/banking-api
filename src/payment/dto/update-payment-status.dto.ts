import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

export class UpdatePaymentStatusDto {
  @ApiProperty({
    description: 'New payment status',
    enum: PaymentStatus,
    enumName: 'PaymentStatus',
    example: PaymentStatus.COMPLETED,
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus, {
    message: 'status must be one of the following: initiated, processing, completed, failed',
  })
  status: PaymentStatus;
} 