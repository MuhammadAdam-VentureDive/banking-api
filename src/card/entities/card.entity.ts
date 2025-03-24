import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

export enum CardType {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
}

@Entity('cards')
export class Card extends BaseEntity {
  @ApiProperty({ description: 'Card holder name' })
  @Column({ name: 'card_holder_name' })
  cardHolderName: string;

  @ApiProperty({ description: 'Card number last 4 digits' })
  @Column({ name: 'last_four_digits' })
  lastFourDigits: string;

  @Exclude()
  @Column({ select: false, name: 'encrypted_card_number' })
  encryptedCardNumber: string;

  @ApiProperty({ enum: CardType, description: 'Card type' })
  @Column({
    type: 'enum',
    enum: CardType,
    name: 'card_type'
  })
  cardType: CardType;

  @ApiProperty({ description: 'Card expiry month' })
  @Column({ name: 'expiry_month' })
  expiryMonth: string;

  @ApiProperty({ description: 'Card expiry year' })
  @Column({ name: 'expiry_year' })
  expiryYear: string;

  @ApiProperty({ description: 'Is this the default card' })
  @Column({ default: false, name: 'is_default' })
  isDefault: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;
} 