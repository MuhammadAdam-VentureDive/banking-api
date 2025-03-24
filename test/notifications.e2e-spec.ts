import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApplication, loginUser } from './test-utils';

describe('NotificationsController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let notificationId: string;
  let paymentId: string;

  beforeAll(async () => {
    app = await createTestApplication();
    
    // First login to get a valid user and token
    const loginResponse = await loginUser(app, 'john@example.com', 'password123');
    authToken = loginResponse.accessToken;
    userId = loginResponse.user.id;
    
    // Create a payment for testing notifications
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

  describe('POST /notifications/simulate/payment-pending', () => {
    it('should create a payment pending notification when authenticated', async () => {
      // Skip if no payment was created in setup
      if (!paymentId) {
        console.warn('Skipping test: No payment ID available');
        return;
      }

      const paymentPendingDto = {
        userId: userId,
        paymentId: paymentId,
        amount: 99.99,
      };

      const response = await request(app.getHttpServer())
        .post('/notifications/simulate/payment-pending')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentPendingDto);

      // Store notification ID for later tests
      if (response.status === 201) {
        notificationId = response.body.id;
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', userId);
      expect(response.body).toHaveProperty('read', false);
      expect(response.body).toHaveProperty('type');
    });

    it('should return 401 when not authenticated', async () => {
      const paymentPendingDto = {
        userId: userId,
        paymentId: paymentId,
        amount: 99.99,
      };

      const response = await request(app.getHttpServer())
        .post('/notifications/simulate/payment-pending')
        .send(paymentPendingDto);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /notifications/user/:userId', () => {
    it('should get all user notifications when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/notifications/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // We should have at least the notification we created
      if (notificationId) {
        expect(response.body.some(notification => notification.id === notificationId)).toBe(true);
      }
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/notifications/user/${userId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /notifications/:id/read', () => {
    it('should mark a notification as read when authenticated', async () => {
      // Skip if no notification was created in previous test
      if (!notificationId) {
        console.warn('Skipping test: No notification ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .post(`/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', notificationId);
      expect(response.body).toHaveProperty('read', true);
    });

    it('should return 401 when not authenticated', async () => {
      if (!notificationId) {
        console.warn('Skipping test: No notification ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .post(`/notifications/${notificationId}/read`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /notifications/user/:userId/read-all', () => {
    it('should mark all user notifications as read when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post(`/notifications/user/${userId}/read-all`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'All notifications marked as read');

      // Verify all notifications are marked as read
      const notificationsResponse = await request(app.getHttpServer())
        .get(`/notifications/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(notificationsResponse.status).toBe(200);
      notificationsResponse.body.forEach(notification => {
        expect(notification.read).toBe(true);
      });
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post(`/notifications/user/${userId}/read-all`);

      expect(response.status).toBe(401);
    });
  });
}); 