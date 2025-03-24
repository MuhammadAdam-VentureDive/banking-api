import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddCardDto } from './dto/add-card.dto';

@ApiTags('cards')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all cards for a user' })
  @ApiResponse({ status: 200, description: 'Returns user cards', type: [Card] })
  getUserCards(@Param('userId') userId: string): Promise<Card[]> {
    return this.cardService.getUserCards(userId);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new card' })
  @ApiResponse({ status: 201, description: 'Card added successfully', type: Card })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  addCard(@Body() addCardDto: AddCardDto): Promise<Card> {
    return this.cardService.addCard(
      addCardDto.userId,
      addCardDto.cardNumber,
      addCardDto.cardHolderName,
      addCardDto.expiryMonth,
      addCardDto.expiryYear,
      addCardDto.cvv,
    );
  }
  
  /*
  @Post(':id/set-default')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set a card as the default' })
  @ApiResponse({ status: 200, description: 'Card set as default', type: Card })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  setDefaultCard(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<Card> {
    return this.cardService.setDefaultCard(body.userId, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a card' })
  @ApiResponse({ status: 200, description: 'Card deleted successfully' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid JWT token' })
  async deleteCard(@Param('id') id: string): Promise<{ message: string }> {
    await this.cardService.deleteCard(id);
    return { message: 'Card deleted successfully' };
  }
  */
} 