import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkout, CheckoutStatus, PaymentMethod } from './entities/checkout.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Checkout)
    private checkoutRepository: Repository<Checkout>,
    private userService: UserService,
  ) {}

  async findById(id: string): Promise<Checkout> {
    const checkout = await this.checkoutRepository.findOne({ where: { id } });
    if (!checkout) {
      throw new NotFoundException(`Checkout with ID ${id} not found`);
    }
    return checkout;
  }

  async createCheckout(
    userId: string,
    amount: number,
    merchantName: string,
    merchantId: string,
  ): Promise<Checkout> {
    const checkout = this.checkoutRepository.create({
      userId,
      amount,
      merchantName,
      merchantId,
      status: CheckoutStatus.PENDING,
    });
    return this.checkoutRepository.save(checkout);
  }

  async getCheckoutDetails(id: string): Promise<Checkout> {
    return this.findById(id);
  }

  async selectPaymentMethod(
    id: string,
    paymentMethod: PaymentMethod,
  ): Promise<Checkout> {
    const checkout = await this.findById(id);
    
    if (checkout.status !== CheckoutStatus.PENDING) {
      throw new BadRequestException('Cannot select payment method for non-pending checkout');
    }
    
    checkout.selectedPaymentMethod = paymentMethod;
    return this.checkoutRepository.save(checkout);
  }

  async generateQrCode(id: string): Promise<Checkout> {
    const checkout = await this.findById(id);
    
    if (!checkout.selectedPaymentMethod) {
      throw new BadRequestException('Payment method must be selected before generating QR code');
    }
    
    // In a real app, we would generate a proper QR code
    // For this example, we'll just use a simplified mock
    const qrData = `PAYMENT:${checkout.id}:METHOD:${checkout.selectedPaymentMethod}:AMOUNT:${checkout.amount}`;
    checkout.qrCodeData = qrData;
    
    return this.checkoutRepository.save(checkout);
  }

  async updateStatus(id: string, status: CheckoutStatus): Promise<Checkout> {
    const checkout = await this.findById(id);
    checkout.status = status;
    return this.checkoutRepository.save(checkout);
  }
} 