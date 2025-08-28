import { test, expect } from '@playwright/test';

test.describe('API Authentication Tests', () => {
  test.skip('should login successfully and return token', async ({ request }) => {
    await test.step('Log in using API with username: admin and password: password', async () => {
      console.log('Making request to: http://localhost/api/auth/login');
      
      const response = await request.post('http://localhost/api/auth/login', {
        data: {
          username: 'admin',
          password: 'password'
        },
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      console.log('Response status:', response.status());
      console.log('Response headers:', await response.headers());
      
      if (response.status() !== 200) {
        console.log('Response body:', await response.text());
      }

      expect(response.status()).toBe(200);
      
      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('token');
      expect(typeof responseBody.token).toBe('string');
      expect(responseBody.token.length).toBeGreaterThan(0);
    });
  });
});
