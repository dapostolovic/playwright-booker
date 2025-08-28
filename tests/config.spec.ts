import { test, expect } from '@playwright/test';
import { AppConfig, Environment } from '../config/app.config';

test.describe('Configuration Tests', () => {
  test('should use correct base URL based on environment', async ({ page }) => {
    // Log the current configuration for debugging
    console.log('Current environment:', Environment.current);
    console.log('Base URL:', Environment.baseUrl);
    
    // Verify that the base URL is being used correctly
    await page.goto('/');
    const currentUrl = page.url();
    
    // The URL should start with the configured base URL
    expect(currentUrl).toContain(Environment.baseUrl.replace('http://', ''));
    
    console.log('Actual page URL:', currentUrl);
  });
});
