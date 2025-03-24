import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApplication, getAuthToken, loginUser } from './test-utils';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

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

  describe('GET /users/:id', () => {
    it('should get user by ID when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('username');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`);

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app.getHttpServer())
        .get(`/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  // Uncomment and implement these if the notification endpoints are enabled
  /*
  describe('GET /users/:id/notifications/count', () => {
    it('should get notification count when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}/notifications/count`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(typeof response.body.count).toBe('number');
    });
  });

  describe('GET /users/:id/reset-notifications', () => {
    it('should reset notification count when authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${userId}/reset-notifications`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Notification count reset');

      // Verify count is reset
      const countResponse = await request(app.getHttpServer())
        .get(`/users/${userId}/notifications/count`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(countResponse.body.count).toBe(0);
    });
  });
  */
}); 