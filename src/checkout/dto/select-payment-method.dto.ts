import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentMethod } from '../entities/checkout.entity';

export class SelectPaymentMethodDto {
  @ApiProperty({
    description: 'Payment method to be used for the checkout',
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod, {
    message: 'paymentMethod must be one of the following: credit_card, crypto, sn_tokens, gbp_wallet',
  })
  paymentMethod: PaymentMethod;
} 