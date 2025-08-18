import { test as base, Page } from '@playwright/test';
import { ApiUtils } from '../utils/api.utils';
import { UiUtils } from '../utils/ui.utils';
import { config } from '../config/test.config';
import { TestUser } from '../types/common.types';
import { AdminPage } from '../pages/admin.page';
import { adminCredentials } from '../data/test-data';
import { ApiRoomHelpers } from '../utils/api.room.helpers';

// Define the types for our fixtures
type TestFixtures = {
  api: ApiUtils;
  ui: UiUtils;
  authenticatedApi: ApiUtils;
  testUser: TestUser;
  performStep: (name: string, action: () => Promise<void>) => Promise<void>;
  adminPage: AdminPage;
  authenticatedAdmin: AdminPage;
  apiRoomCreated: { roomName: string; success: boolean };
};

// Extend the base test with our fixtures
export const test = base.extend<TestFixtures>({
  // API utilities fixture
  api: async ({}, use) => {
    const apiUtils = new ApiUtils();
    await use(apiUtils);
  },

  // UI utilities fixture
  ui: async ({ page }, use) => {
    const uiUtils = new UiUtils(page);
    await use(uiUtils);
  },

  // Authenticated API fixture
  authenticatedApi: async ({}, use) => {
    const apiUtils = new ApiUtils();
    
    // Authenticate with default credentials
    try {
      await apiUtils.authenticate({
        username: config.defaultUser.username,
        password: config.defaultUser.password
      });
    } catch (error) {
      console.warn('Failed to authenticate with default credentials:', error);
    }
    
    await use(apiUtils);
  },

  // Test user fixture
  testUser: async ({}, use) => {
    const user: TestUser = {
      username: config.defaultUser.username,
      password: config.defaultUser.password,
      email: config.defaultUser.email
    };
    await use(user);
  },

  // Performance step wrapper
  performStep: async ({}, use) => {
    const performStep = async (name: string, action: () => Promise<void>) => {
      await base.step(name, action);
    };
    await use(performStep);
  },

  // Admin page fixture
  adminPage: async ({ page }, use) => {
    const adminPage = new AdminPage(page);
    await use(adminPage);
  },

  // Authenticated admin fixture
  authenticatedAdmin: async ({ page }, use) => {
    const adminPage = new AdminPage(page);
    
    // Navigate to admin portal and login
    await adminPage.goto();
    await adminPage.loginAndVerifySuccess(adminCredentials.valid);
    
    await use(adminPage);
    
    // Cleanup: logout after test
    try {
      await adminPage.logout();
    } catch (error) {
      console.warn('Failed to logout from admin portal:', error);
    }
  },

  // API room creation fixture
  apiRoomCreated: async ({}, use) => {
    const result = await ApiRoomHelpers.createDefaultTestRoom();
    
    if (!result.success) {
      throw new Error(`Failed to create room via API: ${result.error}`);
    }
    
    await use({
      roomName: result.roomName,
      success: result.success
    });
    
    // Note: Room cleanup would need to be implemented if delete API is available
    console.log(`ℹ️ Room ${result.roomName} created via API (cleanup not implemented)`);
  }
});

// Export expect from Playwright
export { expect } from '@playwright/test';
