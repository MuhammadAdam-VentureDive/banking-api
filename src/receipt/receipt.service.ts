import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from './entities/receipt.entity';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entities/payment.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    private paymentService: PaymentService,
  ) {}

  async findById(id: string): Promise<Receipt> {
    const receipt = await this.receiptRepository.findOne({ where: { id } });
    if (!receipt) {
      throw new NotFoundException(`Receipt with ID ${id} not found`);
    }
    return receipt;
  }

  async findByPaymentId(paymentId: string): Promise<Receipt> {
    const receipt = await this.receiptRepository.findOne({ where: { paymentId } });
    if (!receipt) {
      throw new NotFoundException(`Receipt for payment ${paymentId} not found`);
    }
    return receipt;
  }

  async generateReceipt(paymentId: string): Promise<Receipt> {
    // Check if receipt already exists
    const existingReceipt = await this.receiptRepository.findOne({ where: { paymentId } });
    if (existingReceipt) {
      return existingReceipt;
    }
    
    // Get payment details
    const payment = await this.paymentService.findById(paymentId);
    
    // Create a new receipt
    const receipt = this.receiptRepository.create({
      paymentId: payment.id,
      userId: payment.userId,
      receiptNumber: `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      merchantName: 'Sample Merchant', // This would come from the checkout in a real app
      transactionDate: new Date(),
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.status,
      items: [
        { name: 'Sample Item', price: payment.amount, quantity: 1 }
      ],
      emailSent: false,
    });
    
    return this.receiptRepository.save(receipt);
  }

  async sendReceiptByEmail(
    id: string, 
    email?: string, 
    subject?: string, 
    message?: string
  ): Promise<Receipt> {
    // In a real app, this would send an actual email
    // For example:
    // if (email) {
    //   const emailSubject = subject || `Your Receipt ${receipt.receiptNumber}`;
    //   const emailMessage = message || `Thank you for your purchase from ${receipt.merchantName}!`;
    //   await this.emailService.sendReceiptEmail(email, emailSubject, emailMessage, receipt);
    // }
    
    const receipt = await this.findById(id);
    receipt.emailSent = true;
    return this.receiptRepository.save(receipt);
  }

  async getUserReceipts(userId: string): Promise<Receipt[]> {
    return this.receiptRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
} 