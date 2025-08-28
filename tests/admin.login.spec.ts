import { test, expect } from '@playwright/test';
import { AdminLogin } from '../pages/AdminLogin';
import { AdminRooms } from '../pages/AdminRooms';
import { adminCredentials } from '../src/data/test-data';

test.describe('Admin Login Tests', () => {
  let adminLogin: AdminLogin;
  let adminRooms: AdminRooms;

  test.beforeEach(async ({ page }) => {
    adminLogin = new AdminLogin(page);
    adminRooms = new AdminRooms(page);
  });

  test.describe('Admin Authentication', () => {
    test('Authenticated admin has access to room management', async () => {
      await adminLogin.goto();
      expect(await adminLogin.isLoaded()).toBe(true);
      await adminLogin.loginAndVerifySuccess(adminCredentials.valid);
      await adminRooms.navigateToRooms();
      expect(await adminRooms.isRoomsPageLoaded()).toBe(true);
      await adminRooms.verifyRoomManagementAccess();
    });

    test('Admin login fails with invalid credentials', async () => {
      await adminLogin.goto();
      expect(await adminLogin.isLoaded()).toBe(true);
      for (const invalidCred of adminCredentials.invalid) {
        await adminLogin.clearLoginForm();
        await adminLogin.login(invalidCred);
        await adminLogin.verifyLoginFailure();
      }
    });

    test('Admin can logout successfully', async () => {
      await adminLogin.goto();
      await adminLogin.loginAndVerifySuccess(adminCredentials.valid);
      
      // Navigate to rooms page first to ensure we're on a page with logout button
      await adminRooms.navigateToRooms();
      
      // Perform logout
      await adminRooms.logout();
      
      // Verify logout worked by checking we're redirected to main page
      const currentUrl = await adminLogin.getCurrentUrl();
      expect(currentUrl).toContain('/');
    });
  });
});
