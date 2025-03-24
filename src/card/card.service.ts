import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card, CardType } from './entities/card.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    private notificationsService: NotificationsService,
  ) {}

  async findById(id: string): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return card;
  }

  async getUserCards(userId: string): Promise<Card[]> {
    return this.cardRepository.find({
      where: { userId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async addCard(
    userId: string,
    cardNumber: string,
    cardHolderName: string,
    expiryMonth: string,
    expiryYear: string,
    cvv: string,
  ): Promise<Card> {
    // In a real app, we would use proper encryption for card data
    // and validate the card with a payment processor
    // For this example, we'll just mock the encryption and validation
    
    // Determine card type based on first digit
    let cardType = CardType.VISA;
    if (cardNumber.startsWith('4')) {
      cardType = CardType.VISA;
    } else if (cardNumber.startsWith('5')) {
      cardType = CardType.MASTERCARD;
    } else if (cardNumber.startsWith('3')) {
      cardType = CardType.AMEX;
    }
    
    // Check if this is the first card for the user
    const existingCards = await this.getUserCards(userId);
    const isDefault = existingCards.length === 0;
    
    // Create new card
    const card = this.cardRepository.create({
      userId,
      cardHolderName,
      lastFourDigits: cardNumber.slice(-4),
      encryptedCardNumber: `ENCRYPTED_${cardNumber}`, // Mock encryption
      cardType,
      expiryMonth,
      expiryYear,
      isDefault,
    });
    
    const savedCard = await this.cardRepository.save(card);
    
    // Create notification for new card added
    await this.notificationsService.createNotification(
      userId,
      'New Card Added',
      `Your ${cardType} card ending in ${card.lastFourDigits} has been added successfully.`,
      NotificationType.NEW_CARD_ADDED,
      card.id,
    );
    
    return savedCard;
  }

  async setDefaultCard(userId: string, cardId: string): Promise<Card> {
    // First, set all user cards to non-default
    await this.cardRepository.update(
      { userId },
      { isDefault: false },
    );
    
    // Then set the selected card as default
    const card = await this.findById(cardId);
    card.isDefault = true;
    return this.cardRepository.save(card);
  }

  async deleteCard(id: string): Promise<void> {
    const card = await this.findById(id);
    await this.cardRepository.remove(card);
  }
} 