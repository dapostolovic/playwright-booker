import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminLogin extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: any) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Enter username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginErrorMessage = page.getByRole('alert', { name: 'Invalid credentials' });
  }

  async isLoaded(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  async login(credentials: { username: string; password: string }): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
    await this.waitForPageLoad();
  }

  async isLoginFailed(): Promise<boolean> {
    // Check that we're still on login page or error message is shown
    const isStillOnLoginPage = await this.isLoaded();
    const hasErrorMessage = await this.loginErrorMessage.isVisible();
    
    return isStillOnLoginPage || hasErrorMessage;
  }
}
