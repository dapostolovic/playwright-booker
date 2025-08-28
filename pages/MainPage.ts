import { Locator, Page, expect } from '@playwright/test';
import { AppConfig } from '../config/app.config';

export class MainPage {
  readonly page: Page;
  readonly rooms: Locator;  
  readonly roomCard: Locator;
  readonly roomCardTitle: Locator;
  readonly bookNowButton: Locator;
  readonly roomDetailsHeader: Locator;
  readonly reserveNowButton: Locator;
  readonly contactNameInput: Locator; 
  readonly contactEmailInput: Locator;
  readonly contactPhoneInput: Locator;
  readonly contactSubjectInput: Locator;
  readonly contactMessageInput: Locator;
  readonly contactSubmitButton: Locator;  
  readonly contactSuccessMessage: Locator;
  readonly contactErrorMessage: Locator;
  readonly welcomeTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rooms = page.locator('#rooms');
    this.roomCard = page.locator('.room-card');
    this.roomCardTitle = page.locator('.card-title');
    this.bookNowButton = page.locator('a.btn.btn-primary');
    this.roomDetailsHeader = page.locator('h1.fw-bold.mb-2');
    this.reserveNowButton = page.locator('button#doReservation');
    this.contactNameInput = page.locator('[data-testid="ContactName"]');
    this.contactEmailInput = page.locator('[data-testid="ContactEmail"]');
    this.contactPhoneInput = page.locator('[data-testid="ContactPhone"]');
    this.contactSubjectInput = page.locator('[data-testid="ContactSubject"]');
    this.contactMessageInput = page.locator('[data-testid="ContactDescription"]');
    this.contactSubmitButton = page.locator('button.btn.btn-primary');
    this.contactSuccessMessage = page.locator('h3.h4.mb-4');
    this.contactErrorMessage = page.locator('.alert.alert-danger');
    this.welcomeTitle = page.locator('h1.display-4:has-text("Welcome to")');
  }

  /**
   * Navigate to booking homepage (room selection page)
   */
  async gotoMainPage() {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async isWelcomeTitleVisible(): Promise<boolean> {
    return await this.welcomeTitle.isVisible();
  }

  async getWelcomeTitleText(): Promise<string> {
    return (await this.welcomeTitle.textContent()) || '';
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
   * Check if homepage with room cards is loaded
   */
  async isHomepageLoaded(): Promise<boolean> {
    return await this.rooms.isVisible();
  }

  /**
   * Verify contact form error message
   */
  async verifyContactFormError(): Promise<void> {
    const errorMessage = this.contactErrorMessage;
    await expect(errorMessage).toBeVisible();
  }

  /**
   * Check if contact form is visible
   */
  async isContactFormVisible(): Promise<boolean> {
    return await this.contactNameInput.isVisible();
  }

  /**
   * Select a room by type and initiate booking
   */
  async selectRoomAndInitiateBooking(roomType: 'Single' | 'Double' | 'Suite'): Promise<void> {
    const roomCard = this.roomCard.filter({ has: this.roomCardTitle.filter({ hasText: roomType }) });

    const bookNowButton = roomCard.locator(this.bookNowButton, { 
      hasText: 'Book now' 
    });

    await bookNowButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Verify room details page is loaded correctly
   */
  async verifyRoomDetailsPage(expectedRoomTitle: string): Promise<void> {
    const headerText = `${expectedRoomTitle} Room`;
    
    // Verify room title header is visible
    const roomHeader = this.roomDetailsHeader.filter({ hasText: headerText });
    await expect(roomHeader).toBeVisible();

    // Verify Reserve Now button is visible
    const reserveButton = this.reserveNowButton.filter({ hasText: 'Reserve Now' });
    await expect(reserveButton).toBeVisible();
  }

  /**
   * Get room details header text
   */
  async getRoomDetailsHeaderText(): Promise<string> {
    return (await this.roomDetailsHeader.textContent()) || '';
  }

  /**
   * Check if Reserve Now button is visible
   */
  async isReserveNowButtonVisible(): Promise<boolean> {
    return await this.reserveNowButton.isVisible();
  }
  
  /**
   * Fill contact form with provided data
   */
  async fillContactForm(contactData: { name: string; email: string; phone: string; subject: string; message: string }): Promise<void> {
    await this.contactNameInput.fill(contactData.name);
    await this.contactEmailInput.fill(contactData.email);
    await this.contactPhoneInput.fill(contactData.phone);
    await this.contactSubjectInput.fill(contactData.subject);
    await this.contactMessageInput.fill(contactData.message);
  }

  /**
   * Submit contact form
   */
  async submitContactForm(): Promise<void> {
    const submitButton = this.contactSubmitButton.filter({ hasText: 'Submit' });
    await submitButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Verify contact form success message with dynamic name
   */
  async verifyContactFormSuccess(fullName: string): Promise<void> {
    const expectedMessage = `Thanks for getting in touch ${fullName}!`;
    const successMessage = this.contactSuccessMessage.filter({ hasText: expectedMessage });
    await expect(successMessage).toBeVisible();
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

  /**
   * Get element text
   */
  protected async getElementText(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return await element.textContent() || '';
  }
}
