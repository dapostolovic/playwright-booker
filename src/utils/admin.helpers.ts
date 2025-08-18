import { Page } from '@playwright/test';
import { AdminPage } from '../pages/admin.page';
import { adminCredentials } from '../data/test-data';

/**
 * Admin helper utilities for reusable admin operations
 */
export class AdminHelpers {
  
  /**
   * Quick admin login for tests that need admin access
   */
  static async quickAdminLogin(page: Page): Promise<AdminPage> {
    const adminPage = new AdminPage(page);
    await adminPage.goto();
    await adminPage.loginAndVerifySuccess(adminCredentials.valid);
    return adminPage;
  }

  /**
   * Ensure admin is logged in, login if not
   */
  static async ensureAdminLogin(adminPage: AdminPage): Promise<void> {
    if (!(await adminPage.isDashboardLoaded())) {
      await adminPage.goto();
      await adminPage.loginAndVerifySuccess(adminCredentials.valid);
    }
  }

  /**
   * Safe admin logout with error handling
   */
  static async safeAdminLogout(adminPage: AdminPage): Promise<void> {
    try {
      await adminPage.logout();
    } catch (error) {
      console.warn('Failed to logout from admin portal:', error);
    }
  }
}
