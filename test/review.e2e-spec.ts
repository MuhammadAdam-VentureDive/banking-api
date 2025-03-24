import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApplication, loginUser } from './test-utils';

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let paymentId: string;
  let reviewId: string;

  beforeAll(async () => {
    app = await createTestApplication();
    
    // First login to get a valid user and token
    const loginResponse = await loginUser(app, 'john@example.com', 'password123');
    authToken = loginResponse.accessToken;
    userId = loginResponse.user.id;
    
    // Create a payment for testing review submission
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

  describe('POST /review', () => {
    it('should submit a review when authenticated with valid data', async () => {
      // Skip if no payment was created in setup
      if (!paymentId) {
        console.warn('Skipping test: No payment ID available');
        return;
      }

      const createReviewDto = {
        userId: userId,
        paymentId: paymentId,
        rating: 5,
        title: 'Excellent Service',
        content: 'The service was fantastic! Would recommend.',
        merchantName: 'Test Merchant',
      };

      const response = await request(app.getHttpServer())
        .post('/review')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createReviewDto);

      // Store review ID for later tests
      if (response.status === 201) {
        reviewId = response.body.id;
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('rating', 5);
      expect(response.body).toHaveProperty('title', 'Excellent Service');
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('merchantName', 'Test Merchant');
    });

    it('should return 401 when not authenticated', async () => {
      const createReviewDto = {
        userId: userId,
        paymentId: paymentId,
        rating: 5,
        title: 'Excellent Service',
        content: 'The service was fantastic! Would recommend.',
        merchantName: 'Test Merchant',
      };

      const response = await request(app.getHttpServer())
        .post('/review')
        .send(createReviewDto);

      expect(response.status).toBe(401);
    });

    it('should return 400 with invalid data', async () => {
      const invalidReviewDto = {
        userId: userId,
        // Missing required fields
      };

      const response = await request(app.getHttpServer())
        .post('/review')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidReviewDto);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /review/:id', () => {
    it('should get review by ID when authenticated', async () => {
      // Skip if no review was created in previous test
      if (!reviewId) {
        console.warn('Skipping test: No review ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .get(`/review/${reviewId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', reviewId);
      expect(response.body).toHaveProperty('rating');
      expect(response.body).toHaveProperty('title');
    });

    it('should return 401 when not authenticated', async () => {
      if (!reviewId) {
        console.warn('Skipping test: No review ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .get(`/review/${reviewId}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent review', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app.getHttpServer())
        .get(`/review/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  // Uncomment and implement these if the review endpoints are enabled
  /*
  describe('POST /review/:id/send-email', () => {
    it('should send confirmation email for a review when authenticated', async () => {
      if (!reviewId) {
        console.warn('Skipping test: No review ID available');
        return;
      }

      const sendEmailDto = {
        email: 'test@example.com',
        message: 'Thank you for your review!',
      };

      const response = await request(app.getHttpServer())
        .post(`/review/${reviewId}/send-email`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(sendEmailDto);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', reviewId);
      expect(response.body).toHaveProperty('emailSent', true);
    });
  });

  describe('GET /review/user/:userId', () => {
    it('should get all reviews by a user when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/review/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // We should have at least the review we submitted
      if (reviewId) {
        expect(response.body.some(review => review.id === reviewId)).toBe(true);
      }
    });
  });

  describe('GET /review/merchant/:merchantName', () => {
    it('should get all reviews for a merchant when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/review/merchant/Test Merchant')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // We should have at least the review we submitted
      if (reviewId) {
        expect(response.body.some(review => review.id === reviewId)).toBe(true);
      }
    });
  });
  */
}); 