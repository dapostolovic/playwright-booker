import { test, expect } from '@playwright/test';

test.describe('Configuration Tests', () => {
  test('should use correct base URL based on environment', async ({ page }) => {

    // Verify that the base URL is being used correctly
    await page.goto('/');
    const currentUrl = page.url();
    
    // The URL should start with the configured base URL
    const baseUrl = process.env.BASE_URL || '';
    expect(currentUrl).toContain(baseUrl.replace('http://', ''));
    
    console.log('Base page URL:', currentUrl);
  });
});