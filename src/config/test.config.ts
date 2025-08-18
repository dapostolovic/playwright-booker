import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface TestConfig {
  baseUrl: string;
  apiBaseUrl: string;
  actionTimeout: number;
  navigationTimeout: number;
  testTimeout: number;
  expectTimeout: number;
  globalTimeout: number;
  retries: number;
  workers: number;
  headless: boolean;
  slowMo: number;
  viewport: {
    width: number;
    height: number;
  };
  defaultUser: {
    username: string;
    password: string;
    email: string;
  };
  api: {
    timeout: number;
    maxRetries: number;
    retryDelay: number;
  };
}

export const config: TestConfig = {
  // Base URLs
  baseUrl: process.env.BASE_URL || 'http://localhost',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost/api',

  // Timeouts (in milliseconds)
  actionTimeout: parseInt(process.env.ACTION_TIMEOUT || '10000'),
  navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
  testTimeout: parseInt(process.env.TEST_TIMEOUT || '60000'),
  expectTimeout: parseInt(process.env.EXPECT_TIMEOUT || '5000'),
  globalTimeout: parseInt(process.env.GLOBAL_TIMEOUT || '600000'), // 10 minutes

  // Test execution settings
  retries: parseInt(process.env.RETRIES || '0'),
  workers: parseInt(process.env.WORKERS || '4'),
  headless: process.env.HEADLESS !== 'false',
  slowMo: parseInt(process.env.SLOW_MO || '0'),

  // Viewport settings
  viewport: {
    width: parseInt(process.env.VIEWPORT_WIDTH || '1280'),
    height: parseInt(process.env.VIEWPORT_HEIGHT || '720')
  },

  // Default test user credentials
  defaultUser: {
    username: process.env.DEFAULT_USERNAME || 'testuser',
    password: process.env.DEFAULT_PASSWORD || 'testpass',
    email: process.env.DEFAULT_EMAIL || 'test@example.com'
  },

  // API settings
  api: {
    timeout: parseInt(process.env.API_TIMEOUT || '10000'),
    maxRetries: parseInt(process.env.API_MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.API_RETRY_DELAY || '1000')
  }
};
