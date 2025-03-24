import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { Checkout, PaymentMethod } from './entities/checkout.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { SelectPaymentMethodDto } from './dto/select-payment-method.dto';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('payment-methods')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all available payment methods' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns list of all payment methods',
    schema: {
      type: 'object',
      properties: {
        paymentMethods: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'credit_card' },
              name: { type: 'string', example: 'Credit Card' }
            }
          }
        }
      }
    }
  })
  getPaymentMethods() {
    return {
      paymentMethods: [
        { id: PaymentMethod.CREDIT_CARD, name: 'Credit Card' },
        { id: PaymentMethod.CRYPTO, name: 'Cryptocurrency' },
        { id: PaymentMethod.SN_TOKENS, name: 'SN Tokens' },
        { id: PaymentMethod.GBP_WALLET, name: 'GBP Wallet' },
      ]
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new checkout session' })
  @ApiResponse({ status: 201, description: 'Checkout created', type: Checkout })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  async create(@Body() createCheckoutDto: CreateCheckoutDto): Promise<Checkout> {
    return this.checkoutService.createCheckout(
      createCheckoutDto.userId,
      createCheckoutDto.amount,
      createCheckoutDto.merchantName,
      createCheckoutDto.merchantId,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get checkout details with available payment methods' })
  @ApiResponse({ status: 200, description: 'Returns checkout details', type: Checkout })
  @ApiResponse({ status: 404, description: 'Checkout not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  async getCheckoutDetails(@Param('id') id: string): Promise<Checkout> {
    return this.checkoutService.getCheckoutDetails(id);
  }
  
  /*
  @Post(':id/payment-method')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Select payment method for checkout' })
  @ApiResponse({ status: 200, description: 'Payment method selected', type: Checkout })
  @ApiResponse({ status: 400, description: 'Invalid payment method or checkout status' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Checkout not found' })
  async selectPaymentMethod(
    @Param('id') id: string,
    @Body() selectPaymentMethodDto: SelectPaymentMethodDto,
  ): Promise<Checkout> {
    return this.checkoutService.selectPaymentMethod(
      id,
      selectPaymentMethodDto.paymentMethod,
    );
  }
  */

  @Post(':id/scan')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate QR code for checkout' })
  @ApiResponse({ status: 200, description: 'QR code generated', type: Checkout })
  @ApiResponse({ status: 400, description: 'Payment method not selected' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Checkout not found' })
  async generateQrCode(@Param('id') id: string): Promise<Checkout> {
    return this.checkoutService.generateQrCode(id);
  }
} 