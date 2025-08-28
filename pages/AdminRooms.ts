import { Locator, Page, expect } from '@playwright/test';
import { AppConfig } from '../config/app.config';

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

export class AdminRooms {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly roomFormContainer: Locator;
  readonly roomNameInput: Locator;
  readonly roomTypeSelect: Locator;
  readonly accessibleSelect: Locator;
  readonly wifiCheckbox: Locator;
  readonly roomPriceInput: Locator;
  readonly refreshmentsCheckbox: Locator;
  readonly tvCheckbox: Locator;
  readonly safeCheckbox: Locator;
  readonly radioCheckbox: Locator;
  readonly viewsCheckbox: Locator;
  readonly createRoomButton: Locator;
  readonly roomDeleteButton: Locator; 
  readonly roomErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.roomFormContainer = page.locator('.row.room-form.mt-2');
    this.roomNameInput = page.getByTestId('roomName');
    this.roomTypeSelect = page.locator('#type');
    this.accessibleSelect = page.locator('#accessible');
    this.wifiCheckbox = page.locator('#wifiCheckbox');
    this.roomPriceInput = page.locator('#roomPrice'); 
    this.refreshmentsCheckbox = page.locator('#refreshCheckbox');
    this.tvCheckbox = page.locator('#tvCheckbox');
    this.safeCheckbox = page.locator('#safeCheckbox');
    this.radioCheckbox = page.locator('#radioCheckbox');
    this.viewsCheckbox = page.locator('#viewsCheckbox');
    this.createRoomButton = page.locator('#createRoom');
    this.roomDeleteButton = page.locator('.fa.fa-remove.roomDelete');
    this.roomErrorMessage = page.locator('.alert.alert-danger');
  }

  /**
   * Dynamic locator method to get room list item
   */  
  getRoomListItem(roomName: string): Locator {
    return this.page.locator(`#roomName${roomName}`);
  }

  /**
   * Navigate to admin rooms page
   */
  async gotoRoomsPage(): Promise<void> {
    try {
      await this.navigateTo(AppConfig.routes.admin.rooms);
      await this.waitForPageLoad();
    } catch (error) {
      // If navigation fails, it might be due to authentication issues
      // This is expected behavior when not logged in
      console.log('Navigation to admin rooms failed - likely due to authentication');
    }
  }

  /**
   * Check if rooms page is loaded
   */
  async isRoomsPageLoaded(): Promise<boolean> {
    try {
      // Wait for the page to be ready
      await this.page.waitForLoadState('networkidle', { timeout: 5000 });
      
      const currentUrl = await this.getCurrentUrl();
      const isCorrectUrl = AppConfig.routes.isAdminRoomsRoute(currentUrl);
      
      // Also verify that key elements are visible
      const hasRoomForm = await this.roomFormContainer.isVisible();
      
      return isCorrectUrl && hasRoomForm;
    } catch (error) {
      console.log('Error checking if rooms page is loaded:', error);
      return false;
    }
  }

  /**
   * Logout from admin portal
   */
  async logout(): Promise<void> {
    const logoutButton = this.logoutButton;
    
    // Try to find and click logout button
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await this.waitForPageLoad();
    } else {
      // If logout button is not visible, try to navigate to main page directly
      await this.navigateTo('/');
      await this.waitForPageLoad();
    }
  }

  /**
   * Navigate to rooms management section
   */
  async navigateToRooms(): Promise<void> {
    await this.gotoRoomsPage();
    // Only expect to be on rooms page if we're authenticated
    const isOnRoomsPage = await this.isRoomsPageLoaded();
    if (!isOnRoomsPage) {
      // If not on rooms page, we might have been redirected due to authentication
      const currentUrl = await this.getCurrentUrl();
      if (AppConfig.routes.isAdminRoute(currentUrl)) {
        // We're on admin page but not rooms - this might be expected
        console.log('Redirected to admin page instead of rooms page');
      }
    }
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
   * Fill room creation form
   */
  async fillRoomForm(roomData: AdminRoomFormData): Promise<void> {
    const formContainer = this.roomFormContainer;
    
    // Fill basic room information
    await formContainer.locator(this.roomNameInput).fill(roomData.roomName);
    await formContainer.locator(this.roomTypeSelect).selectOption(roomData.type);
    await formContainer.locator(this.accessibleSelect).selectOption(roomData.accessible.toString());
    await formContainer.locator(this.roomPriceInput).fill(roomData.price.toString());
    
    // Handle feature checkboxes
    const features = roomData.features;
    
    if (features.wifi) {
      await formContainer.locator(this.wifiCheckbox).check();
    }
    if (features.refreshments) {
      await formContainer.locator(this.refreshmentsCheckbox).check();
    }
    if (features.tv) {
      await formContainer.locator(this.tvCheckbox).check();
    }
    if (features.safe) {
      await formContainer.locator(this.safeCheckbox).check();
    }
    if (features.radio) {
      await formContainer.locator(this.radioCheckbox).check();
    }
    if (features.views) {
      await formContainer.locator(this.viewsCheckbox).check();
    }
  }

  /**
   * Submit room creation form
   */
  async submitRoomCreation(): Promise<void> {
    const formContainer = this.roomFormContainer;
    await formContainer.locator(this.createRoomButton).click();
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
    const roomElement = this.getRoomListItem(roomName);
    await expect(roomElement).toBeVisible();
  }

  /**
   * Verify room creation error
   */
  async verifyRoomCreationError(): Promise<void> {
    await expect(this.roomErrorMessage).toBeVisible();
  }

  /**
   * Delete a room by room name
   */
  async deleteRoom(roomName: string): Promise<void> {
    // Find the room element
    const roomElement = this.getRoomListItem(roomName);
    
    // Find the delete button in the same row/container
    const deleteButton = roomElement
      .locator('xpath=..')  // Go to parent
      .locator('xpath=following-sibling::div')  // Find sibling div
      .locator(this.roomDeleteButton);
        
    await deleteButton.click();
  }

  /**
   * Verify room is deleted (should disappear within 500ms)
   */
  async verifyRoomDeleted(roomName: string): Promise<void> {
    const roomElement = this.getRoomListItem(roomName);
    
    // Wait for element to be hidden with a timeout of 500ms
    await expect(roomElement).toBeHidden({ timeout: 500 });
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
