import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';
import { CardType } from '../entities/card.entity';

export class AddCardDto {
  @ApiProperty({
    description: 'User ID',
    example: '54404291-c4ec-48b1-8481-b4d4205fd510',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Card number',
    example: '4111111111111111',
  })
  @IsNotEmpty()
  @IsString()
  @Length(13, 19)
  @Matches(/^[0-9]+$/, { message: 'Card number must contain only digits' })
  cardNumber: string;

  @ApiProperty({
    description: 'Card holder name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  cardHolderName: string;

  @ApiProperty({
    description: 'Card expiry month',
    example: '12',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 2)
  @Matches(/^(0?[1-9]|1[0-2])$/, { message: 'Expiry month must be between 1 and 12' })
  expiryMonth: string;

  @ApiProperty({
    description: 'Card expiry year',
    example: '2025',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 4)
  @Matches(/^[0-9]+$/, { message: 'Expiry year must contain only digits' })
  expiryYear: string;

  @ApiProperty({
    description: 'Card CVV',
    example: '123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 4)
  @Matches(/^[0-9]+$/, { message: 'CVV must contain only digits' })
  cvv: string;
} 