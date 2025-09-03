import { defineConfig } from '@playwright/test';

// Environment-based configuration
const getBaseUrl = () => {
  console.log('Environment variables:', {
    STAGING: process.env.STAGING,
    DEVELOPMENT: process.env.DEVELOPMENT,
    PRODUCTION: process.env.PRODUCTION,
    BASE_URL: process.env.BASE_URL
  });
  
  if (process.env.STAGING === '1') {
    return process.env.STAGING_URL || 'http://staging.example.test/';
  }
  if (process.env.DEVELOPMENT === '1') {
    return process.env.DEV_URL || 'http://dev.example.test/';
  }
  if (process.env.PRODUCTION === '1') {
    return process.env.PROD_URL || 'http://prod.example.test/';
  }
  return process.env.BASE_URL || 'http://localhost/';
};

/* API URL configuration:
  Base URL: http://localhost/ ->  API Base URL: http://localhost/api/
  Base URL: http://staging.example.test/ ->  API Base URL: http://staging.example.test/api/
  Base URL: http://dev.example.test/ ->  API Base URL: http://dev.example.test/api/
  Base URL: http://prod.example.test/ ->  API Base URL: http://prod.example.test/api/
*/
const getApiBaseUrl = () => {
  const baseUrl = getBaseUrl();
  // Remove trailing slash if present and append /api/
  const domain = baseUrl.replace(/\/$/, ''); 
  const apiUrl = `${domain}/api/`;
  console.log('API Base URL configured:', apiUrl);
  return apiUrl;
};

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*spec.ts',

  use: {
    baseURL: getBaseUrl(),
  },
  
  // Environment variables available in tests
  env: {
    API_BASE_URL: getApiBaseUrl(),
  },
    
  /* Maximum time one test can run for. */
  timeout: 90 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* tests in parallel */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Configure projects for major browsers, chrome is kept only for now */
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
      },
    },
  ],
});