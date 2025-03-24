import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @ApiProperty({ description: 'Rating (1-5)' })
  @Column({ type: 'int' })
  rating: number;

  @ApiProperty({ description: 'Review title' })
  @Column({ nullable: true })
  title: string;

  @ApiProperty({ description: 'Review content' })
  @Column({ nullable: true })
  content: string;

  @ApiProperty({ description: 'Merchant name' })
  @Column({ name: 'merchant_name' })
  merchantName: string;

  @ApiProperty({ description: 'Email confirmation sent' })
  @Column({ default: false, name: 'email_sent' })
  emailSent: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Payment)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ name: 'payment_id' })
  paymentId: string;
} 