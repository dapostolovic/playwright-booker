import { test, expect } from '../src/fixtures/test.fixtures';
import { AdminPage } from '../src/pages/admin.page';
import { adminCredentials } from '../src/data/test-data';

test.describe('Admin Portal Tests', () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
  });

  test.describe('Admin Authentication', () => {
    test('Admin can login with valid credentials', async ({ performStep }) => {
      await performStep('Navigate to admin login page', async () => {
        await adminPage.goto();
        expect(await adminPage.isLoaded()).toBe(true);
      });

      await performStep('Login with valid admin credentials', async () => {
        await adminPage.loginAndVerifySuccess(adminCredentials.valid);
      });

      await performStep('Verify access to admin dashboard', async () => {
        expect(await adminPage.isDashboardLoaded()).toBe(true);
      });

      await performStep('Verify access to room management', async () => {
        await adminPage.verifyRoomManagementAccess();
      });
    });

    test('Admin login fails with invalid credentials', async ({ performStep }) => {
      await performStep('Navigate to admin login page', async () => {
        await adminPage.goto();
        expect(await adminPage.isLoaded()).toBe(true);
      });

      for (const invalidCred of adminCredentials.invalid) {
        await performStep(`Test login failure with credentials: ${invalidCred.username}/${invalidCred.password}`, async () => {
          await adminPage.clearLoginForm();
          await adminPage.login(invalidCred);
          await adminPage.verifyLoginFailure();
        });
      }
    });

    test('Admin can logout successfully', async ({ performStep }) => {
      await performStep('Login as admin', async () => {
        await adminPage.goto();
        await adminPage.loginAndVerifySuccess(adminCredentials.valid);
      });

      await performStep('Logout from admin portal', async () => {
        await adminPage.logout();
        
        // Verify we're back to login page or logged out
        await adminPage.goto();
        expect(await adminPage.isLoaded()).toBe(true);
      });
    });
  });

  test.describe('Admin Dashboard Access', () => {
    test('Authenticated admin has access to room management', async ({ authenticatedAdmin, performStep }) => {
      await performStep('Verify admin is logged in and has dashboard access', async () => {
        expect(await authenticatedAdmin.isDashboardLoaded()).toBe(true);
      });

      await performStep('Verify admin can access room management section', async () => {
        await authenticatedAdmin.navigateToRooms();
        expect(await authenticatedAdmin.isRoomsPageLoaded()).toBe(true);
      });
    });
  });
});
