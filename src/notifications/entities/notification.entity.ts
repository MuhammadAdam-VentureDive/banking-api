import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

export enum NotificationType {
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_COMPLETED = 'payment_completed',
  NEW_CARD_ADDED = 'new_card_added',
  REVIEW_REMINDER = 'review_reminder',
}

@Entity('notifications')
export class Notification extends BaseEntity {
  @ApiProperty({ description: 'Notification title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Notification content' })
  @Column()
  content: string;

  @ApiProperty({ enum: NotificationType, description: 'Type of notification' })
  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.PAYMENT_PENDING,
  })
  type: NotificationType;

  @ApiProperty({ description: 'Whether the notification has been read' })
  @Column({ default: false, name: 'is_read' })
  isRead: boolean;

  @ApiProperty({ description: 'Reference ID related to the notification (payment ID, etc.)' })
  @Column({ nullable: true, name: 'reference_id' })
  referenceId: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;
} 