import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private notificationsService: NotificationsService,
    private paymentService: PaymentService,
  ) {}

  async findById(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async createReview(
    userId: string,
    paymentId: string,
    rating: number,
    title: string,
    content: string,
    merchantName: string,
  ): Promise<Review> {
    // Validate payment exists
    await this.paymentService.findById(paymentId);
    
    // Create review
    const review = this.reviewRepository.create({
      userId,
      paymentId,
      rating,
      title,
      content,
      merchantName,
      emailSent: false,
    });
    
    const savedReview = await this.reviewRepository.save(review);
    
    // Create review reminder notification
    await this.notificationsService.createNotification(
      userId,
      'Review Submitted',
      `Thank you for submitting your review for ${merchantName}!`,
      NotificationType.REVIEW_REMINDER,
      review.id,
    );
    
    return savedReview;
  }

  async sendConfirmationEmail(id: string, email?: string, message?: string): Promise<Review> {
    const review = await this.findById(id);
    
    // Here you would implement actual email sending logic
    // For example:
    // if (email) {
    //   await this.emailService.sendEmail(
    //     email,
    //     'Review Confirmation',
    //     message || `Thank you for your review of ${review.merchantName}!`
    //   );
    // }
    
    review.emailSent = true;
    return this.reviewRepository.save(review);
  }

  async getUserReviews(userId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getMerchantReviews(merchantName: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { merchantName },
      order: { createdAt: 'DESC' },
    });
  }
} 