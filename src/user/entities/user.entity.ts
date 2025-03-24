import { Entity, Column, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ description: 'User email address' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Username' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'Full name' })
  @Column({ name: 'full_name' })
  fullName: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: 'GBP wallet balance' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'gbp_wallet_balance' })
  gbpWalletBalance: number;

  @ApiProperty({ description: 'Crypto wallet balance' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'crypto_balance' })
  cryptoBalance: number;

  @ApiProperty({ description: 'SN token balance' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'sn_token_balance' })
  snTokenBalance: number;

  @ApiProperty({ description: 'Number of unread notifications' })
  @Column({ default: 0, name: 'notification_count' })
  notificationCount: number;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
} 