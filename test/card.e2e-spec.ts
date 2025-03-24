import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApplication, loginUser } from './test-utils';

describe('CardController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let cardId: string;

  beforeAll(async () => {
    app = await createTestApplication();
    
    // First login to get a valid user and token
    const loginResponse = await loginUser(app, 'john@example.com', 'password123');
    authToken = loginResponse.accessToken;
    userId = loginResponse.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /card/add', () => {
    it('should add a new card when authenticated with valid data', async () => {
      const addCardDto = {
        userId: userId,
        cardNumber: '4111111111111111', // Test card number
        cardHolderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: 2030,
        cvv: '123',
      };

      const response = await request(app.getHttpServer())
        .post('/card/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send(addCardDto);

      // Store card ID for later tests
      if (response.status === 201) {
        cardId = response.body.id;
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('cardHolderName', 'John Doe');
      expect(response.body).toHaveProperty('lastFourDigits', '1111');
    });

    it('should return 401 when not authenticated', async () => {
      const addCardDto = {
        userId: userId,
        cardNumber: '4111111111111111',
        cardHolderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: 2030,
        cvv: '123',
      };

      const response = await request(app.getHttpServer())
        .post('/card/add')
        .send(addCardDto);

      expect(response.status).toBe(401);
    });

    it('should return 400 with invalid data', async () => {
      const invalidCardDto = {
        userId: userId,
        cardNumber: 'invalid-card-number',
        cardHolderName: 'John Doe',
        expiryMonth: 12,
        expiryYear: 2030,
        cvv: '123',
      };

      const response = await request(app.getHttpServer())
        .post('/card/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCardDto);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /card/user/:userId', () => {
    it('should get all user cards when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/card/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // We should have at least the card we added
      if (cardId) {
        expect(response.body.some(card => card.id === cardId)).toBe(true);
      }
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/card/user/${userId}`);

      expect(response.status).toBe(401);
    });
  });

  // Uncomment and implement these if the endpoints are enabled
  /*
  describe('POST /card/:id/set-default', () => {
    it('should set a card as default when authenticated', async () => {
      // Skip if no card was created in previous test
      if (!cardId) {
        console.warn('Skipping test: No card ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .post(`/card/${cardId}/set-default`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: userId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', cardId);
      expect(response.body).toHaveProperty('isDefault', true);
    });
  });

  describe('DELETE /card/:id', () => {
    it('should delete a card when authenticated', async () => {
      // Skip if no card was created in previous test
      if (!cardId) {
        console.warn('Skipping test: No card ID available');
        return;
      }

      const response = await request(app.getHttpServer())
        .delete(`/card/${cardId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Card deleted successfully');

      // Verify card is deleted
      const getResponse = await request(app.getHttpServer())
        .get(`/card/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.body.some(card => card.id === cardId)).toBe(false);
    });
  });
  */
}); 