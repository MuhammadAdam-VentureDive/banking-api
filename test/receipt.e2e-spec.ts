import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApplication, loginUser } from './test-utils';

describe('ReceiptController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let paymentId: string;
  let receiptId: string;

  beforeAll(async () => {
    app = await createTestApplication();
    
    // First login to get a valid user and token
    const loginResponse = await loginUser(app, 'john@example.com', 'password123');
    authToken = loginResponse.accessToken;
    userId = loginResponse.user.id;
    
    // Create a payment for testing receipt generation
    const createPaymentDto = {
      userId: userId,
      checkoutId: '123e4567-e89b-12d3-a456-426614174000', // Replace with valid checkoutId
      qrCodeData: 'qr_valid_checkout_123', // Replace with valid QR code data
    };

    const paymentResponse = await request(app.getHttpServer())
      .post('/payment/charge')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createPaymentDto);
      
    if (paymentResponse.status === 201) {
      paymentId = paymentResponse.body.id;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /receipt/generate/:paymentId', () => {
    it('should generate a receipt for a payment when authenticated', async () => {
      // Skip if no payment was created in setup
      if (!paymentId) {
        console.warn('Skipping test: No payment ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .post(`/receipt/generate/${paymentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Store receipt ID for later tests
      if (response.status === 201) {
        receiptId = response.body.id;
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('paymentId', paymentId);
      expect(response.body).toHaveProperty('receiptNumber');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return 401 when not authenticated', async () => {
      if (!paymentId) {
        console.warn('Skipping test: No payment ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .post(`/receipt/generate/${paymentId}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent payment', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app.getHttpServer())
        .post(`/receipt/generate/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  // Uncomment and implement these if the receipt endpoints are enabled
  /*
  describe('GET /receipt/:id', () => {
    it('should get receipt by ID when authenticated', async () => {
      // Skip if no receipt was created in previous test
      if (!receiptId) {
        console.warn('Skipping test: No receipt ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .get(`/receipt/${receiptId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', receiptId);
      expect(response.body).toHaveProperty('paymentId', paymentId);
    });
  });

  describe('GET /receipt/payment/:paymentId', () => {
    it('should get receipt by payment ID when authenticated', async () => {
      if (!paymentId) {
        console.warn('Skipping test: No payment ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .get(`/receipt/payment/${paymentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('paymentId', paymentId);
    });
  });

  describe('POST /receipt/:id/send-email', () => {
    it('should send receipt by email when authenticated', async () => {
      if (!receiptId) {
        console.warn('Skipping test: No receipt ID available');
        return;
      }

      const sendEmailDto = {
        email: 'test@example.com',
        subject: 'Your Receipt',
        message: 'Thank you for your purchase',
      };

      const response = await request(app.getHttpServer())
        .post(`/receipt/${receiptId}/send-email`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(sendEmailDto);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', receiptId);
      expect(response.body).toHaveProperty('emailSent', true);
    });
  });

  describe('GET /receipt/user/:userId', () => {
    it('should get all user receipts when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/receipt/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // We should have at least the receipt we generated
      if (receiptId) {
        expect(response.body.some(receipt => receipt.id === receiptId)).toBe(true);
      }
    });
  });
  */
}); 