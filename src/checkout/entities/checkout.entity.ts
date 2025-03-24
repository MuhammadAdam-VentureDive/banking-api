import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  CRYPTO = 'crypto',
  SN_TOKENS = 'sn_tokens',
  GBP_WALLET = 'gbp_wallet',
}

export enum CheckoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('checkouts')
export class Checkout extends BaseEntity {
  @ApiProperty({ description: 'Checkout amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Merchant name' })
  @Column({ name: 'merchant_name' })
  merchantName: string;

  @ApiProperty({ description: 'Merchant ID' })
  @Column({ name: 'merchant_id' })
  merchantId: string;

  @ApiProperty({ enum: CheckoutStatus, description: 'Checkout status' })
  @Column({
    type: 'enum',
    enum: CheckoutStatus,
    default: CheckoutStatus.PENDING,
  })
  status: CheckoutStatus;

  @ApiProperty({ enum: PaymentMethod, description: 'Selected payment method', nullable: true })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
    name: 'selected_payment_method'
  })
  selectedPaymentMethod: PaymentMethod | null;

  @ApiProperty({ description: 'QR code data for payment', nullable: true })
  @Column({ nullable: true, name: 'qr_code_data' })
  qrCodeData: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;
} 