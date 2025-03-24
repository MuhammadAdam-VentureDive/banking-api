import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApplication } from './test-utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApplication();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should successfully authenticate with valid credentials', async () => {
      // Assuming there's a seeded user with these credentials
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'john@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'invalid@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });

    it('should return 400 with incomplete data', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'john@example.com' }); // Missing password

      expect(response.status).toBe(400);
    });
  });
}); 