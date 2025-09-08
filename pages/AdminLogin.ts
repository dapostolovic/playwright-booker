import { Locator, test } from '@playwright/test';
import { BasePage } from './BasePage';
import { MainPage } from './MainPage';
import { AdminRooms } from './AdminRooms';
import { Routes } from '../src/config/routes';

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
    this.loginErrorMessage = page.locator('[role="alert"]', { hasText: 'Invalid credentials' });
  }

  async navigateToAdminLoginFromMain(): Promise<void> {
    await test.step('Navigate to main page', async () => {
      const mainPage = new MainPage(this.page);
      await mainPage.gotoMainPage();
    });
    
    await test.step('Navigate to admin login page', async () => {
      const mainPage = new MainPage(this.page);
      await mainPage.navigateToAdminLogin();
    });
  }

  async performLogout(): Promise<void> {
    await test.step('Logout from admin panel', async () => {
      const adminRooms = new AdminRooms(this.page);
      await adminRooms.logout();
    });    
  }  

  async isLoaded(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  async performLogin(credentials: { username: string; password: string }): Promise<void> {
    await this.loginInitiate(credentials);
    await test.step('Open admin rooms page', async () => {
      await this.waitForRedirect(Routes.adminRooms);
    });
  }

  async loginInitiate(credentials: { username: string; password: string }): Promise<void> {
    await test.step('Initiate login', async () => {
      await this.navigateToAdminLoginFromMain();
      await this.usernameInput.fill(credentials.username);
      await this.passwordInput.fill(credentials.password);
      await this.loginButton.click();
    });
  }
}
