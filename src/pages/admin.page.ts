import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { AdminCredentials, AdminRoomData } from '../types/common.types';

export interface AdminRoomFormData {
  roomName: string;
  type: 'Single' | 'Twin' | 'Double' | 'Family' | 'Suite';
  accessible: boolean;
  price: number;
  features: {
    wifi: boolean;
    refreshments: boolean;
    tv: boolean;
    safe: boolean;
    radio: boolean;
    views: boolean;
  };
}

export interface RoomCreationValidation {
  roomName: { required: true };
  price: { required: true; minimum: 1 };
}

/**
 * Test data for admin room management
 */
export const adminRoomTestData = {
  validRoom: {
    roomName: '301',
    type: 'Double' as const,
    accessible: true,
    price: 150,
    features: {
      wifi: true,
      refreshments: true,
      tv: true,
      safe: true,
      radio: true,
      views: true
    }
  },
  
  invalidRooms: {
    emptyRoomName: {
      roomName: '',
      type: 'Single' as const,
      accessible: false,
      price: 100,
      features: {
        wifi: false,
        refreshments: false,
        tv: false,
        safe: false,
        radio: false,
        views: false
      }
    },
    
    invalidPrice: {
      roomName: '302',
      type: 'Single' as const,
      accessible: false,
      price: 0, // Invalid price (must be > 1)
      features: {
        wifi: false,
        refreshments: false,
        tv: false,
        safe: false,
        radio: false,
        views: false
      }
    }
  },
  
  testRoom: {
    roomName: '999', // For deletion test
    type: 'Suite' as const,
    accessible: false,
    price: 250,
    features: {
      wifi: true,
      refreshments: false,
      tv: true,
      safe: false,
      radio: false,
      views: true
    }
  }
};

/**
 * Generate random room number for testing
 */
export const generateRandomRoomNumber = (): string => {
  return Math.floor(Math.random() * (999 - 201) + 201).toString();
};

export class AdminPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Page selectors
  private get selectors() {
    return {
      // Login form selectors
      usernameInput: 'input[placeholder="Enter username"]',
      passwordInput: 'input[placeholder="Password"]',
      loginButton: '#doLogin',
      
      // Admin dashboard selectors
      adminDashboard: '[data-testid="admin-dashboard"]',
      logoutButton: 'button.btn.btn-outline-danger',
      
      // Room management selectors
      roomsSection: '#rooms-section',
      addRoomButton: '#add-room',
      roomsList: '.rooms-list',
      roomItem: '.room-item',
      
      // Messages
      loginErrorMessage: '.alert-danger',
      successMessage: '.alert-success',
      errorMessage: '.alert-error',
      
      // Room form container
      roomFormContainer: '.row.room-form.mt-2',
      
      // Room form selectors
      roomNameInput: '#roomName',
      roomTypeSelect: '#type',
      accessibleSelect: '#accessible',
      roomPriceInput: '#roomPrice',
      
      // Feature checkboxes
      wifiCheckbox: '#wifiCheckbox',
      refreshmentsCheckbox: '#refreshCheckbox',
      tvCheckbox: '#tvCheckbox',
      safeCheckbox: '#safeCheckbox',
      radioCheckbox: '#radioCheckbox',
      viewsCheckbox: '#viewsCheckbox',
      
      // Room form actions
      createRoomButton: '#createRoom',
      
      // Room list and deletion
      roomListItem: (roomName: string) => `#roomName${roomName}`,
      roomDeleteButton: '.fa.fa-remove.roomDelete',
      
      // Room form messages
      roomErrorMessage: '.alert.alert-danger'
    };
  }

  /**
   * Navigate to admin login page
   */
  async goto(): Promise<void> {
    await this.ui.navigateTo('/admin');
    await this.waitForPageLoad();
  }

  /**
   * Navigate to admin rooms page
   */
  async gotoRoomsPage(): Promise<void> {
    await this.ui.navigateTo('/admin/rooms');
    await this.waitForPageLoad();
  }

  /**
   * Check if admin login page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.loginButton);
  }

  /**
   * Check if admin dashboard is loaded (after successful login)
   */
  async isDashboardLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.roomsSection) || 
           await this.getCurrentUrl().then(url => url.includes('/admin/rooms'));
  }

  /**
   * Check if rooms page is loaded
   */
  async isRoomsPageLoaded(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return currentUrl.includes('/admin/rooms');
  }

  /**
   * Perform admin login
   */
  async login(credentials: AdminCredentials): Promise<void> {
    await this.fillInput(this.selectors.usernameInput, credentials.username);
    await this.fillInput(this.selectors.passwordInput, credentials.password);
    await this.clickElement(this.selectors.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Perform admin login and verify success
   */
  async loginAndVerifySuccess(credentials: AdminCredentials): Promise<void> {
    await this.login(credentials);
    
    // Verify successful login by checking URL or dashboard elements
    const isLoggedIn = await this.isDashboardLoaded();
    expect(isLoggedIn).toBe(true);
  }

  /**
   * Verify login failure with error message
   */
  async verifyLoginFailure(): Promise<void> {
    // Check that we're still on login page or error message is shown
    const isStillOnLoginPage = await this.isLoaded();
    const hasErrorMessage = await this.isElementVisible(this.selectors.loginErrorMessage);
    
    expect(isStillOnLoginPage || hasErrorMessage).toBe(true);
  }

  /**
   * Get current admin username from UI (if displayed)
   */
  async getCurrentUser(): Promise<string | null> {
    try {
      return await this.getElementText('[data-testid="current-user"]');
    } catch {
      return null;
    }
  }

  /**
   * Logout from admin portal
   */
  async logout(): Promise<void> {
    const logoutButton = this.page.locator(this.selectors.logoutButton, { 
      hasText: 'Logout' 
    });
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await this.waitForPageLoad();
    }
  }

  /**
   * Navigate to rooms management section
   */
  async navigateToRooms(): Promise<void> {
    await this.gotoRoomsPage();
    expect(await this.isRoomsPageLoaded()).toBe(true);
  }

  /**
   * Verify admin has access to room management
   */
  async verifyRoomManagementAccess(): Promise<void> {
    await this.navigateToRooms();
    const hasAccess = await this.isRoomsPageLoaded();
    expect(hasAccess).toBe(true);
  }

  /**
   * Clear login form
   */
  async clearLoginForm(): Promise<void> {
    await this.fillInput(this.selectors.usernameInput, '');
    await this.fillInput(this.selectors.passwordInput, '');
  }

  /**
   * Get login error message text
   */
  async getLoginErrorMessage(): Promise<string> {
    return await this.getElementText(this.selectors.loginErrorMessage);
  }

  /**
   * Check if specific element exists on admin dashboard
   */
  async hasAccessToFeature(featureSelector: string): Promise<boolean> {
    return await this.isElementVisible(featureSelector);
  }

  /**
   * Fill room creation form
   */
  async fillRoomForm(roomData: AdminRoomFormData): Promise<void> {
    const formContainer = this.page.locator(this.selectors.roomFormContainer);
    
    // Fill basic room information
    await formContainer.locator(this.selectors.roomNameInput).fill(roomData.roomName);
    await formContainer.locator(this.selectors.roomTypeSelect).selectOption(roomData.type);
    await formContainer.locator(this.selectors.accessibleSelect).selectOption(roomData.accessible.toString());
    await formContainer.locator(this.selectors.roomPriceInput).fill(roomData.price.toString());
    
    // Handle feature checkboxes
    const features = roomData.features;
    
    if (features.wifi) {
      await formContainer.locator(this.selectors.wifiCheckbox).check();
    }
    if (features.refreshments) {
      await formContainer.locator(this.selectors.refreshmentsCheckbox).check();
    }
    if (features.tv) {
      await formContainer.locator(this.selectors.tvCheckbox).check();
    }
    if (features.safe) {
      await formContainer.locator(this.selectors.safeCheckbox).check();
    }
    if (features.radio) {
      await formContainer.locator(this.selectors.radioCheckbox).check();
    }
    if (features.views) {
      await formContainer.locator(this.selectors.viewsCheckbox).check();
    }
  }

  /**
   * Submit room creation form
   */
  async submitRoomCreation(): Promise<void> {
    const formContainer = this.page.locator(this.selectors.roomFormContainer);
    await formContainer.locator(this.selectors.createRoomButton).click();
    await this.waitForPageLoad();
  }

  /**
   * Create a new room
   */
  async createRoom(roomData: AdminRoomFormData): Promise<void> {
    await this.fillRoomForm(roomData);
    await this.submitRoomCreation();
  }

  /**
   * Verify room creation success
   */
  async verifyRoomCreated(roomName: string): Promise<void> {
    const roomElement = this.page.locator(this.selectors.roomListItem(roomName));
    await expect(roomElement).toBeVisible();
  }

  /**
   * Verify room creation error
   */
  async verifyRoomCreationError(): Promise<void> {
    const errorMessage = this.page.locator(this.selectors.roomErrorMessage);
    await expect(errorMessage).toBeVisible();
  }

  /**
   * Delete a room by room name
   */
  async deleteRoom(roomName: string): Promise<void> {
    // Find the room element
    const roomElement = this.page.locator(this.selectors.roomListItem(roomName));
    
    // Find the delete button in the same row/container
    const deleteButton = roomElement
      .locator('xpath=..')  // Go to parent
      .locator('xpath=following-sibling::div')  // Find sibling div
      .locator(this.selectors.roomDeleteButton);
        
    await deleteButton.click();
  }

  /**
   * Verify room is deleted (should disappear within 500ms)
   */
  async verifyRoomDeleted(roomName: string): Promise<void> {
    const roomElement = this.page.locator(this.selectors.roomListItem(roomName));
    
    // Wait for element to be hidden with a timeout of 500ms
    await expect(roomElement).toBeHidden({ timeout: 500 });
  }

  /**
   * Check if room exists in the list
   */
  async isRoomInList(roomName: string): Promise<boolean> {
    return await this.isElementVisible(this.selectors.roomListItem(roomName));
  }

  /**
   * Get room creation error message
   */
  async getRoomCreationErrorText(): Promise<string> {
    return await this.getElementText(this.selectors.roomErrorMessage);
  }

  /**
   * Clear room form
   */
  async clearRoomForm(): Promise<void> {
    const formContainer = this.page.locator(this.selectors.roomFormContainer);
    
    await formContainer.locator(this.selectors.roomNameInput).fill('');
    await formContainer.locator(this.selectors.roomPriceInput).fill('');
    
    // Uncheck all checkboxes
    await formContainer.locator(this.selectors.wifiCheckbox).uncheck();
    await formContainer.locator(this.selectors.refreshmentsCheckbox).uncheck();
    await formContainer.locator(this.selectors.tvCheckbox).uncheck();
    await formContainer.locator(this.selectors.safeCheckbox).uncheck();
    await formContainer.locator(this.selectors.radioCheckbox).uncheck();
    await formContainer.locator(this.selectors.viewsCheckbox).uncheck();
  }
}
