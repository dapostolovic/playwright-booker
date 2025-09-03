import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { AdminLogin } from '../pages/AdminLogin';
import { AdminRooms } from '../pages/AdminRooms';
import { adminCredentials } from '../src/data/test-data';

test.describe('Admin Authentication Tests', () => {
  let mainPage: MainPage;
  let adminLogin: AdminLogin;
  let adminRooms: AdminRooms;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    adminLogin = new AdminLogin(page);
    adminRooms = new AdminRooms(page);
  });

  test('Admin can login with valid credentials and access room management', async () => {
    await test.step('Navigate to admin login page', async () => {
      await mainPage.gotoMainPage();
      await mainPage.navigateToAdminLogin();
    });

    await test.step('Verify login page is loaded', async () => {
      expect(await adminLogin.isLoaded()).toBe(true);
    });

    await test.step('Login with valid admin credentials', async () => {
      await adminLogin.login(adminCredentials.valid);
    });

    await test.step('Verify successful login by checking room management access', async () => {
      expect(await adminRooms.isRoomsPageLoaded()).toBe(true);
    });
  });

  test('Admin login fails with invalid credentials', async () => {
    await test.step('Navigate to admin login page', async () => {
      await mainPage.gotoMainPage();
      await mainPage.navigateToAdminLogin();
    });

    await test.step('Attempt login with invalid credentials', async () => {
      await adminLogin.login({ username: 'wrong', password: 'wrong' });
    });

    await test.step('Verify login failure is detected', async () => {
      expect(await adminLogin.isLoginFailed()).toBe(true);
    });
  });

  test('Admin can logout successfully', async () => {
    await test.step('Navigate to admin login page', async () => {
      await mainPage.gotoMainPage();
      await mainPage.navigateToAdminLogin();
    });

    await test.step('Login with valid credentials', async () => {
      await adminLogin.login({ username: 'admin', password: 'password' });
    });

    await test.step('Verify successful login by checking current URL', async () => {
      const currentUrl = await adminLogin.getCurrentUrl();
      expect(currentUrl).toContain('/admin/rooms');
    });

    await test.step('Logout from admin panel', async () => {
      await adminRooms.logout();
    });

    await test.step('Verify logout was successful by checking current URL', async () => {
      const currentUrl = await adminLogin.getCurrentUrl();
      expect(currentUrl).toContain('/');
    });
  });

  test('Admin can access room management after successful login', async () => {
    await test.step('Navigate to admin login page', async () => {
      await mainPage.gotoMainPage();
      await mainPage.navigateToAdminLogin();
    });

    await test.step('Login with valid admin credentials', async () => {
      await adminLogin.login(adminCredentials.valid);
    });

    await test.step('Verify access to room management functionality', async () => {
      const currentUrl = await adminLogin.getCurrentUrl();
      expect(currentUrl).toContain('/admin/rooms');
    });
  });
});
