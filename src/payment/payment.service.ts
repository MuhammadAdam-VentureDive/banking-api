import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { UserService } from '../user/user.service';
import { CheckoutService } from '../checkout/checkout.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CheckoutStatus } from '../checkout/entities/checkout.entity';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private userService: UserService,
    private checkoutService: CheckoutService,
    private notificationsService: NotificationsService,
  ) {}

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async createPayment(
    userId: string,
    checkoutId: string,
    qrCodeData: string,
  ): Promise<Payment> {
    // Process the QR code data
    if (!qrCodeData) {
      throw new BadRequestException('QR code data is required');
    }
    
    const checkout = await this.checkoutService.getCheckoutDetails(checkoutId);
    
    if (!checkout.selectedPaymentMethod) {
      throw new BadRequestException('Payment method not selected');
    }
    
    if (checkout.status !== CheckoutStatus.PENDING) {
      throw new BadRequestException('Checkout is not in a pending state');
    }
    
    // Create a new payment
    const payment = this.paymentRepository.create({
      userId,
      checkoutId,
      amount: checkout.amount,
      paymentMethod: checkout.selectedPaymentMethod,
      status: PaymentStatus.INITIATED,
      transactionReference: `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    });
    
    // Save the payment
    const savedPayment = await this.paymentRepository.save(payment);
    
    // Update checkout status
    await this.checkoutService.updateStatus(checkoutId, CheckoutStatus.PROCESSING);
    
    // Create a notification for the user
    await this.notificationsService.createNotification(
      userId,
      'Payment Processing',
      `Your payment of £${payment.amount} is being processed.`,
      NotificationType.PAYMENT_PENDING,
      payment.id,
    );
    
    return savedPayment;
  }

  async processPayment(id: string): Promise<Payment> {
    const payment = await this.findById(id);
    
    // In a real application, we would process the payment with a payment provider
    // For this demo, we'll simulate a successful payment
    
    payment.status = PaymentStatus.COMPLETED;
    const updatedPayment = await this.paymentRepository.save(payment);
    
    // Update checkout status
    await this.checkoutService.updateStatus(payment.checkoutId, CheckoutStatus.COMPLETED);
    
    // Create a notification for completed payment
    await this.notificationsService.createNotification(
      payment.userId,
      'Payment Completed',
      `Your payment of £${payment.amount} has been completed successfully.`,
      NotificationType.PAYMENT_COMPLETED,
      payment.id,
    );
    
    // Deduct from user's appropriate wallet based on payment method
    if (payment.paymentMethod === 'gbp_wallet') {
      await this.userService.updateWalletBalance(payment.userId, 'gbp', -payment.amount);
    } else if (payment.paymentMethod === 'crypto') {
      await this.userService.updateWalletBalance(payment.userId, 'crypto', -payment.amount);
    } else if (payment.paymentMethod === 'sn_tokens') {
      await this.userService.updateWalletBalance(payment.userId, 'sn', -payment.amount);
    }
    
    return updatedPayment;
  }
} 