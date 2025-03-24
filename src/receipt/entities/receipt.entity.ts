import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('receipts')
export class Receipt extends BaseEntity {
  @ApiProperty({ description: 'Receipt number' })
  @Column({ name: 'receipt_number' })
  receiptNumber: string;

  @ApiProperty({ description: 'Merchant name' })
  @Column({ name: 'merchant_name' })
  merchantName: string;

  @ApiProperty({ description: 'Transaction date' })
  @Column({ type: 'timestamp', name: 'transaction_date' })
  transactionDate: Date;

  @ApiProperty({ description: 'Total amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Payment method used' })
  @Column({ name: 'payment_method' })
  paymentMethod: string;

  @ApiProperty({ description: 'Payment status' })
  @Column({ name: 'payment_status' })
  paymentStatus: string;

  @ApiProperty({ description: 'Items purchased (JSON string)' })
  @Column({ type: 'jsonb', nullable: true })
  items: any;

  @ApiProperty({ description: 'Email receipt sent' })
  @Column({ default: false, name: 'email_sent' })
  emailSent: boolean;

  @OneToOne(() => Payment)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ name: 'payment_id' })
  paymentId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;
} 