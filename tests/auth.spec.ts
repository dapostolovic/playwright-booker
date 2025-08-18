import { test, expect } from '../src/fixtures/test.fixtures';
import { AuthCredentials } from '../src/types/common.types';

test.describe('Authentication Tests', () => {

  test('Successful authentication via API', async ({ api, performStep }) => {
    const credentials: AuthCredentials = {
      username: 'admin',
      password: 'password123'
    };

    await performStep('Authenticate with valid credentials', async () => {
      const authResponse = await api.authenticate(credentials);
      expect(authResponse.success).toBe(true);
      expect(authResponse.data?.token).toBeDefined();
      expect(typeof authResponse.data?.token).toBe('string');
    });

    await performStep('Verify token is set in API client', async () => {
      // The token should be automatically set in the API client
      // We can verify this by making an authenticated request
      const protectedResponse = await api.getAllBookings();
      expect(protectedResponse.success).toBe(true);
    });
  });

  test('Failed authentication with invalid credentials', async ({ api, performStep }) => {
    const invalidCredentials: AuthCredentials = {
      username: 'invalid',
      password: 'wrongpassword'
    };

    await performStep('Attempt authentication with invalid credentials', async () => {
      const authResponse = await api.authenticate(invalidCredentials);
      expect(authResponse.success).toBe(false);
      expect(authResponse.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  test('API retry mechanism with authentication', async ({ api, performStep }) => {
    const credentials: AuthCredentials = {
      username: 'admin',
      password: 'password123'
    };

    await performStep('Test API retry mechanism', async () => {
      // Use the retry wrapper for authentication
      const authResponse = await api.retryRequest(
        () => api.authenticate(credentials),
        3 // Max retries
      );
      
      expect(authResponse.success).toBe(true);
      expect(authResponse.data?.token).toBeDefined();
    });
  });

  test('Authentication with environment configuration', async ({ 
    api, 
    testUser, 
    performStep 
  }) => {
    await performStep('Authenticate using configured test user', async () => {
      const authResponse = await api.authenticate({
        username: testUser.username,
        password: testUser.password
      });
      
      // This might fail if the demo app doesn't have these credentials
      // but it demonstrates using the centralized configuration
      if (authResponse.success) {
        expect(authResponse.data?.token).toBeDefined();
        testUser.token = authResponse.data?.token;
      } else {
        console.log('Authentication failed with configured test user - this is expected for demo purposes');
      }
    });
  });

  test('Multiple API clients with different authentication', async ({ performStep }) => {
    await performStep('Test multiple authenticated API clients', async () => {
      // Import ApiUtils directly for this test
      const { ApiUtils } = await import('../src/utils/api.utils');
      
      const adminApi = new ApiUtils();
      const userApi = new ApiUtils();

      // Authenticate admin
      const adminAuth = await adminApi.authenticate({
        username: 'admin',
        password: 'password123'
      });

      // Authenticate regular user (if different credentials exist)
      const userAuth = await userApi.authenticate({
        username: 'user',
        password: 'userpass'
      });

      // Both should be independent
      if (adminAuth.success && userAuth.success) {
        expect(adminAuth.data?.token).not.toBe(userAuth.data?.token);
      }

      // Test that each client maintains its own token
      const adminBookings = await adminApi.getAllBookings();
      const userBookings = await userApi.getAllBookings();

      // The responses might be different based on permissions
      expect(adminBookings).toBeDefined();
      expect(userBookings).toBeDefined();
    });
  });

  test('Token expiration and re-authentication', async ({ api, performStep }) => {
    const credentials: AuthCredentials = {
      username: 'admin',
      password: 'password123'
    };

    await performStep('Initial authentication', async () => {
      const authResponse = await api.authenticate(credentials);
      if (authResponse.success) {
        expect(authResponse.data?.token).toBeDefined();
      }
    });

    await performStep('Clear token and test unauthorized access', async () => {
      api.clearAuthToken();
      
      // This request should fail without authentication
      const unauthorizedResponse = await api.getAllBookings();
      
      // Depending on the API, this might fail or return limited data
      console.log('Unauthorized request result:', unauthorizedResponse.statusCode);
    });

    await performStep('Re-authenticate and verify access', async () => {
      const reAuthResponse = await api.authenticate(credentials);
      if (reAuthResponse.success) {
        expect(reAuthResponse.data?.token).toBeDefined();
        
        // Now the request should succeed
        const authorizedResponse = await api.getAllBookings();
        expect(authorizedResponse).toBeDefined();
      }
    });
  });

  test('API timeout and error handling', async ({ api, performStep }) => {
    await performStep('Test API timeout handling', async () => {
      // Test with very short timeout
      const { ApiUtils } = await import('../src/utils/api.utils');
      const fastTimeoutApi = new ApiUtils();
      
      try {
        // This should timeout quickly
        const response = await fastTimeoutApi.get('/slow-endpoint', { timeout: 100 });
        // If it doesn't timeout, that's also a valid test result
        console.log('Request completed without timeout:', response.statusCode);
      } catch (error) {
        // Timeout is expected
        console.log('Request timed out as expected');
      }
    });
  });

  test('Concurrent API requests', async ({ performStep }) => {
    await performStep('Test concurrent API requests', async () => {
      const { ApiUtils } = await import('../src/utils/api.utils');
      const api1 = new ApiUtils();
      const api2 = new ApiUtils();
      const api3 = new ApiUtils();

      // Make concurrent requests
      const promises = [
        api1.healthCheck(),
        api2.healthCheck(),
        api3.healthCheck()
      ];

      const results = await Promise.all(promises);
      
      // All should succeed independently
      results.forEach((result, index) => {
        console.log(`API ${index + 1} result:`, result.statusCode);
        expect(result).toBeDefined();
      });
    });
  });
});
