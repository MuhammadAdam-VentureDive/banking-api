import { User } from '../../user/entities/user.entity';
import { NotificationType } from '../../notifications/entities/notification.entity';
import { CardType } from '../../card/entities/card.entity';
import { CheckoutStatus, PaymentMethod } from '../../checkout/entities/checkout.entity';
import { PaymentStatus } from '../../payment/entities/payment.entity';
import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';
// Import all entity classes to make sure they are registered with TypeORM
import { Notification } from '../../notifications/entities/notification.entity';
import { Card } from '../../card/entities/card.entity';
import { Checkout } from '../../checkout/entities/checkout.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { Receipt } from '../../receipt/entities/receipt.entity';
import { Review } from '../../review/entities/review.entity';

async function seed() {
  // Initialize the data source
  await dataSource.initialize();
  
  try {
    console.log('Seeding database...');

    // Hash password
    const password = await bcrypt.hash('password123', 10);
    
    // Create user with direct SQL
    let userId;
    await dataSource.query(`
      INSERT INTO users 
      (email, username, full_name, password, gbp_wallet_balance, crypto_balance, sn_token_balance, notification_count) 
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, ['test@example.com', 'testuser', 'Test User', password, 1000, 500, 250, 0])
    .then(result => {
      userId = result[0].id;
      console.log('User created with ID:', userId);
    });

    // Add notifications
    await dataSource.query(`
      INSERT INTO notifications 
      (title, content, type, is_read, user_id)
      VALUES 
      ('Payment Pending', 'You have a pending payment of £100', 'payment_pending', false, $1),
      ('New Card Added', 'Your VISA card ending in 4242 has been added', 'new_card_added', false, $1)
    `, [userId]);
    console.log('Notifications added');

    // Add a card
    await dataSource.query(`
      INSERT INTO cards 
      (card_holder_name, last_four_digits, encrypted_card_number, card_type, expiry_month, expiry_year, is_default, user_id)
      VALUES 
      ($1, '4242', 'ENCRYPTED_4242424242424242', 'visa', '12', '2025', true, $2)
    `, ['Test User', userId]);
    console.log('Card added');

    // Create checkout
    let checkoutId;
    await dataSource.query(`
      INSERT INTO checkouts 
      (amount, merchant_name, merchant_id, status, selected_payment_method, user_id)
      VALUES 
      (100.00, 'Test Merchant', 'MERCH-123', 'pending', 'gbp_wallet', $1)
      RETURNING id
    `, [userId])
    .then(result => {
      checkoutId = result[0].id;
      console.log('Checkout created with ID:', checkoutId);
    });

    // Create payment
    let paymentId;
    await dataSource.query(`
      INSERT INTO payments 
      (amount, status, payment_method, transaction_reference, checkout_id, user_id)
      VALUES 
      (100.00, 'completed', 'gbp_wallet', $1, $2, $3)
      RETURNING id
    `, [`TRX-${Date.now()}`, checkoutId, userId])
    .then(result => {
      paymentId = result[0].id;
      console.log('Payment created with ID:', paymentId);
    });

    // Create receipt
    await dataSource.query(`
      INSERT INTO receipts 
      (receipt_number, merchant_name, transaction_date, amount, payment_method, payment_status, items, payment_id, user_id)
      VALUES 
      ($1, 'Test Merchant', NOW(), 100.00, 'gbp_wallet', 'completed', '[{"name": "Test Product", "price": 100.00, "quantity": 1}]', $2, $3)
    `, [`REC-${Date.now()}`, paymentId, userId]);
    console.log('Receipt created');

    // Create review
    await dataSource.query(`
      INSERT INTO reviews 
      (rating, title, content, merchant_name, user_id, payment_id)
      VALUES 
      (5, 'Great Service', 'Really enjoyed the service!', 'Test Merchant', $1, $2)
    `, [userId, paymentId]);
    console.log('Review created');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed(); 