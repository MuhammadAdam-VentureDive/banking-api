import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('payments')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('charge')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process payment after QR code scan' })
  @ApiResponse({ status: 201, description: 'Payment initiated', type: Payment })
  @ApiResponse({ status: 400, description: 'Invalid checkout or payment method' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Checkout not found' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.createPayment(
      createPaymentDto.userId,
      createPaymentDto.checkoutId,
      createPaymentDto.qrCodeData,
    );
  }

  @Post(':id/process')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process a payment' })
  @ApiResponse({ status: 200, description: 'Payment processed', type: Payment })
  @ApiResponse({ status: 400, description: 'Payment already processed or in invalid state' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async processPayment(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.processPayment(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details' })
  @ApiResponse({ status: 200, description: 'Returns payment details', type: Payment })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPaymentDetails(@Param('id') id: string): Promise<Payment> {
    return this.paymentService.findById(id);
  }
} 