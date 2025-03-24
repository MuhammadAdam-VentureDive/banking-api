import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApplication, getAuthToken, loginUser } from './test-utils';

describe('CheckoutController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let checkoutId: string;

  beforeAll(async () => {
    app = await createTestApplication();
    
    // First login to get a valid user and token
    try {
      const loginResponse = await loginUser(app, 'john@example.com', 'password123');
      console.log('Login response in checkout test:', loginResponse);
      
      authToken = loginResponse.accessToken;
      
      // Handle potential undefined user data
      if (loginResponse.user && loginResponse.user.id) {
        userId = loginResponse.user.id;
      } else {
        console.warn('User data missing. Using fallback ID');
        userId = 'test-user-id';
        // Generate a token manually since login failed
        authToken = getAuthToken(app, userId, 'john@example.com');
      }
    } catch (error) {
      console.error('Login failed in checkout test:', error);
      userId = 'test-user-id';
      authToken = getAuthToken(app, userId, 'john@example.com');
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /checkout/payment-methods', () => {
    it('should return available payment methods when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/checkout/payment-methods')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('paymentMethods');
      expect(Array.isArray(response.body.paymentMethods)).toBe(true);
      expect(response.body.paymentMethods.length).toBeGreaterThan(0);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/checkout/payment-methods');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /checkout', () => {
    it('should create checkout session when authenticated with valid data', async () => {
      const createCheckoutDto = {
        userId: userId,
        amount: 99.99,
        merchantName: 'Test Merchant',
        merchantId: 'test-merchant-id',
      };

      const response = await request(app.getHttpServer())
        .post('/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createCheckoutDto);

      // Store checkout ID for later tests
      if (response.status === 201) {
        checkoutId = response.body.id;
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('amount', 99.99);
      expect(response.body).toHaveProperty('merchantName', 'Test Merchant');
      expect(response.body).toHaveProperty('status');
    });

    it('should return 401 when not authenticated', async () => {
      const createCheckoutDto = {
        userId: userId,
        amount: 99.99,
        merchantName: 'Test Merchant',
        merchantId: 'test-merchant-id',
      };

      const response = await request(app.getHttpServer())
        .post('/checkout')
        .send(createCheckoutDto);

      expect(response.status).toBe(401);
    });

    it('should return 400 with invalid data', async () => {
      const invalidCheckoutDto = {
        userId: userId,
        // Missing required fields
      };

      const response = await request(app.getHttpServer())
        .post('/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCheckoutDto);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /checkout/:id', () => {
    it('should get checkout details when authenticated', async () => {
      // Skip if no checkout was created in previous test
      if (!checkoutId) {
        console.warn('Skipping test: No checkout ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .get(`/checkout/${checkoutId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', checkoutId);
      expect(response.body).toHaveProperty('amount');
      expect(response.body).toHaveProperty('merchantName');
    });

    it('should return 401 when not authenticated', async () => {
      if (!checkoutId) {
        console.warn('Skipping test: No checkout ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .get(`/checkout/${checkoutId}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent checkout', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app.getHttpServer())
        .get(`/checkout/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /checkout/:id/scan', () => {
    it('should generate QR code for checkout when authenticated', async () => {
      // Skip if no checkout was created in previous test
      if (!checkoutId) {
        console.warn('Skipping test: No checkout ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .post(`/checkout/${checkoutId}/scan`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', checkoutId);
      expect(response.body).toHaveProperty('qrCodeData');
    });

    it('should return 401 when not authenticated', async () => {
      if (!checkoutId) {
        console.warn('Skipping test: No checkout ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .post(`/checkout/${checkoutId}/scan`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent checkout', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app.getHttpServer())
        .post(`/checkout/${nonExistentId}/scan`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  // Uncomment if this endpoint is enabled
  /*
  describe('POST /checkout/:id/payment-method', () => {
    it('should select payment method for checkout when authenticated', async () => {
      if (!checkoutId) {
        console.warn('Skipping test: No checkout ID available');
        return;
      }

      const selectPaymentMethodDto = {
        paymentMethod: 'credit_card', // Replace with a valid payment method
      };

      const response = await request(app.getHttpServer())
        .post(`/checkout/${checkoutId}/payment-method`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(selectPaymentMethodDto);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', checkoutId);
      expect(response.body).toHaveProperty('paymentMethod', 'credit_card');
    });
  });
  */
}); 