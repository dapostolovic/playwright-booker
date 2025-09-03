import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

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

export class AdminRooms extends BasePage {
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

  constructor(page: any) {
    super(page);
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

  async isRoomsPageLoaded(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    const isCorrectUrl = currentUrl.includes('/admin/rooms');
    
    // Also verify that key elements are visible
    const hasRoomForm = await this.roomFormContainer.isVisible();
    
    return isCorrectUrl && hasRoomForm;
  }

  async logout(): Promise<void> {
    const logoutButton = this.logoutButton;    
    await logoutButton.click();
    await this.waitForPageLoad();
  }

  async fillRoomForm(roomData: AdminRoomFormData): Promise<void> {
    const formContainer = this.roomFormContainer;
    
    // Fill basic room information
    await formContainer.locator(this.roomNameInput).fill(roomData.roomName);
    await formContainer.locator(this.roomTypeSelect).selectOption(roomData.type);
    await formContainer.locator(this.accessibleSelect).selectOption(roomData.accessible.toString());
    await formContainer.locator(this.roomPriceInput).fill(roomData.price.toString());
    
    // Handle feature checkboxes using object iteration
    const featureCheckboxes = {
      wifi: this.wifiCheckbox,
      refreshments: this.refreshmentsCheckbox,
      tv: this.tvCheckbox,
      safe: this.safeCheckbox,
      radio: this.radioCheckbox,
      views: this.viewsCheckbox
    };

    // Iterate through features and check/uncheck accordingly
    for (const [feature, checkbox] of Object.entries(featureCheckboxes)) {
      if (roomData.features[feature as keyof typeof roomData.features]) {
        await formContainer.locator(checkbox).check();
      }
    }
  }

  async submitRoomCreation(): Promise<void> {
    const formContainer = this.roomFormContainer;
    await formContainer.locator(this.createRoomButton).click();
    await this.waitForPageLoad();
  }

  async createRoom(roomData: AdminRoomFormData): Promise<void> {
    await this.fillRoomForm(roomData);
    await this.submitRoomCreation();
  }

  async deleteRoom(roomName: string): Promise<void> {
    const deleteButton = this.getRoomListItem(roomName).locator('.roomDelete');
    await deleteButton.waitFor({ state: 'visible', timeout: 500 });
    await deleteButton.click();
  }

  getRoomElement(roomName: string): Locator {
    return this.getRoomListItem(roomName);
  }

  getRoomCreationErrorElement(): Locator {
    return this.roomErrorMessage;
  }

  async attemptInvalidRoomCreation(roomData: AdminRoomFormData): Promise<void> {
    await this.fillRoomForm(roomData);
    await this.submitRoomCreation();
  }
  
  getRoomListItem(roomName: string): Locator {
    return this.page.locator(
      `[data-testid="roomlisting"]:has(#roomName${roomName})`
    );
  }
}
