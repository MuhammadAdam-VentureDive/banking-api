import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UserService,
  ) {}

  async createNotification(
    userId: string,
    title: string,
    content: string,
    type: NotificationType,
    referenceId?: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      title,
      content,
      type,
      referenceId,
      isRead: false,
    });

    await this.userService.incrementNotificationCount(userId);
    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    
    if (!notification.isRead) {
      notification.isRead = true;
      return this.notificationRepository.save(notification);
    }
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
    await this.userService.resetNotificationCount(userId);
  }

  async createPaymentPendingNotification(
    userId: string,
    paymentId: string,
    amount: number,
  ): Promise<Notification> {
    return this.createNotification(
      userId,
      'Payment Pending',
      `You have a pending payment of £${amount}. Please complete your payment.`,
      NotificationType.PAYMENT_PENDING,
      paymentId,
    );
  }
} 