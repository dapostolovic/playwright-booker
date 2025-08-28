import { Locator, Page, expect } from '@playwright/test';
import { AppConfig } from '../config/app.config';

export class AdminLogin {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Enter username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginErrorMessage = page.getByRole('alert', { name: 'Invalid credentials' });
  }

  /**
   * Navigate to admin login page
   */
  async goto(): Promise<void> {
    await this.navigateTo(AppConfig.routes.admin.login);
    await this.waitForPageLoad();
  }

  /**
   * Check if admin login page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  /**
   * Perform admin login
   */
  async login(credentials: { username: string; password: string }): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Perform admin login and verify success
   */
  async loginAndVerifySuccess(credentials: { username: string; password: string }): Promise<void> {
    await this.login(credentials);
    
    // Wait for any redirects to complete
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Additional wait to ensure authentication state is established
    await this.page.waitForTimeout(300);
    
    // Verify successful login by checking URL - admin login should redirect to admin area
    const currentUrl = await this.getCurrentUrl();
    // After successful login, we should be in the admin area (either /admin or /admin/rooms)
    expect(currentUrl).toContain('/admin');
  }

  /**
   * Perform admin login and navigate to rooms page
   */
  async loginAndNavigateToRooms(credentials: { username: string; password: string }): Promise<void> {
    await this.login(credentials);
    
    // Wait a bit for any redirects to complete
    await this.page.waitForTimeout(1000);
    
    // After login, navigate to rooms page if not already there
    const currentUrl = await this.getCurrentUrl();
    if (!currentUrl.includes('/admin/rooms')) {
      await this.navigateTo(AppConfig.routes.admin.rooms);
      await this.waitForPageLoad();
    }
  }

  /**
   * Verify login failure with error message
   */
  async verifyLoginFailure(): Promise<void> {
    // Check that we're still on login page or error message is shown
    const isStillOnLoginPage = await this.isLoaded();
    const hasErrorMessage = await this.loginErrorMessage.isVisible();
    
    expect(isStillOnLoginPage || hasErrorMessage).toBe(true);
  }

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    await this.usernameInput.fill('');
    await this.passwordInput.fill('');
  }

  // Utility methods
  
  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Navigate to a specific path
   */
  async navigateTo(path: string = ''): Promise<void> {
    const url = path.startsWith('http') ? path : `${AppConfig.baseUrl}${path}`;
    await this.page.goto(url);
  }

  /**
   * Click element
   */
  protected async clickElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.click();
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
