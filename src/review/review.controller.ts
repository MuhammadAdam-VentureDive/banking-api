import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { SendEmailDto } from './dto/send-email.dto';

@ApiTags('reviews')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a review' })
  @ApiResponse({ status: 201, description: 'Review submitted', type: Review })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async createReview(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewService.createReview(
      createReviewDto.userId,
      createReviewDto.paymentId,
      createReviewDto.rating,
      createReviewDto.title,
      createReviewDto.content,
      createReviewDto.merchantName,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Returns the review', type: Review })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewService.findById(id);
  }
  
  /*
  @Post(':id/send-email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send confirmation email for a review' })
  @ApiResponse({ status: 200, description: 'Email sent', type: Review })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid email format' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  sendEmail(
    @Param('id') id: string,
    @Body() sendEmailDto?: SendEmailDto
  ): Promise<Review> {
    return this.reviewService.sendConfirmationEmail(
      id, 
      sendEmailDto?.email, 
      sendEmailDto?.message
    );
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews by a user' })
  @ApiResponse({ status: 200, description: 'Returns the user reviews', type: [Review] })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  getUserReviews(@Param('userId') userId: string): Promise<Review[]> {
    return this.reviewService.getUserReviews(userId);
  }

  @Get('merchant/:merchantName')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews for a merchant' })
  @ApiResponse({ status: 200, description: 'Returns the merchant reviews', type: [Review] })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  getMerchantReviews(@Param('merchantName') merchantName: string): Promise<Review[]> {
    return this.reviewService.getMerchantReviews(merchantName);
  }
  */
} 