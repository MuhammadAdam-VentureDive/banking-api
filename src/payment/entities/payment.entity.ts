import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Checkout, PaymentMethod } from '../../checkout/entities/checkout.entity';

export enum PaymentStatus {
  INITIATED = 'initiated',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('payments')
export class Payment extends BaseEntity {
  @ApiProperty({ description: 'Payment amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ enum: PaymentStatus, description: 'Payment status' })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.INITIATED,
  })
  status: PaymentStatus;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method used' })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    name: 'payment_method'
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({ description: 'Transaction reference' })
  @Column({ nullable: true, name: 'transaction_reference' })
  transactionReference: string;

  @ApiProperty({ description: 'Card last 4 digits', nullable: true })
  @Column({ nullable: true, name: 'card_last_four' })
  cardLastFour: string;

  @OneToOne(() => Checkout)
  @JoinColumn({ name: 'checkout_id' })
  checkout: Checkout;

  @Column({ name: 'checkout_id' })
  checkoutId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;
} 