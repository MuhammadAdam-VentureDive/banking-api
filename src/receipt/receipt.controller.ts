import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReceiptService } from './receipt.service';
import { Receipt } from './entities/receipt.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendReceiptEmailDto } from './dto/send-receipt-email.dto';

@ApiTags('receipts')
@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}
  
  /*
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get receipt by ID' })
  @ApiResponse({ status: 200, description: 'Returns the receipt', type: Receipt })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Receipt not found' })
  findOne(@Param('id') id: string): Promise<Receipt> {
    return this.receiptService.findById(id);
  }

  @Get('payment/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get receipt by payment ID' })
  @ApiResponse({ status: 200, description: 'Returns the receipt', type: Receipt })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Receipt not found' })
  findByPaymentId(@Param('paymentId') paymentId: string): Promise<Receipt> {
    return this.receiptService.findByPaymentId(paymentId);
  }
  */

  @Post('generate/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate a receipt for a payment' })
  @ApiResponse({ status: 201, description: 'Receipt generated', type: Receipt })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  generateReceipt(@Param('paymentId') paymentId: string): Promise<Receipt> {
    return this.receiptService.generateReceipt(paymentId);
  }
  
  /*
  @Post(':id/send-email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send receipt by email' })
  @ApiResponse({ status: 200, description: 'Receipt email sent', type: Receipt })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid email format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Receipt not found' })
  sendEmail(
    @Param('id') id: string,
    @Body() sendReceiptEmailDto?: SendReceiptEmailDto
  ): Promise<Receipt> {
    return this.receiptService.sendReceiptByEmail(
      id,
      sendReceiptEmailDto?.email,
      sendReceiptEmailDto?.subject,
      sendReceiptEmailDto?.message
    );
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all receipts for a user' })
  @ApiResponse({ status: 200, description: 'Returns the user receipts', type: [Receipt] })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  getUserReceipts(@Param('userId') userId: string): Promise<Receipt[]> {
    return this.receiptService.getUserReceipts(userId);
  }
  */
} 