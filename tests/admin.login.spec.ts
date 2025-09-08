import { test, expect } from '@playwright/test';
import { AdminLogin } from '../pages/AdminLogin';
import { AdminRooms } from '../pages/AdminRooms';
import { adminCredentials } from '../src/data/test-data';
import { Routes } from '../src/config/routes';

test.describe('Admin Authentication Pozitive Tests', () => {
  let adminLogin: AdminLogin;
  let adminRooms: AdminRooms;

  test.beforeEach(async ({ page }) => {
    adminLogin = new AdminLogin(page);
    adminRooms = new AdminRooms(page);
    await adminLogin.performLogin(adminCredentials.valid);
  });

  test('Admin can login with valid credentials and access room management', async () => {
    expect(await adminRooms.isRoomsPageLoaded(), 'Admin failed to login and access room management').toBe(true);
    await expect(adminRooms.roomFormContainer, 'Room form is not visible').toBeVisible();
  });

  test('Admin can logout successfully', async () => {
    expect(await adminLogin.getCurrentUrl(), 'Admin failed to access room management').toContain(Routes.adminRooms);
    
    await adminLogin.performLogout();
    expect(await adminLogin.getCurrentUrl(), 'Admin failed to logout').toContain(Routes.home);
  });

  test('Admin can access room management after successful login', async () => {
    expect(await adminRooms.isRoomsPageLoaded(), 'Admin failed to login').toBe(true);
    expect(await adminLogin.getCurrentUrl(), 'Admin failed to access room management')
      .toContain(Routes.adminRooms);
  });
});

test.describe('Admin Authentication Negative Tests', () => {
  let adminLogin: AdminLogin;

  test.beforeEach(async ({ page }) => {
    adminLogin = new AdminLogin(page);
  });

  test('Admin login fails with invalid credentials', async () => {
    await adminLogin.loginInitiate(adminCredentials.invalid);
    await expect(adminLogin.loginErrorMessage, 'Login error message is not visible').toBeVisible();
  });
});