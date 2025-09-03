import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MainPage extends BasePage {
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
  readonly menuAdminLogin: Locator; // Add admin link locator

  constructor(page: any) {
    super(page);
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
    this.menuAdminLogin = page.locator('a.nav-link[href="/admin"]'); // Admin link locator
  }

  async gotoMainPage() {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  async navigateToAdminLogin() {
    await this.menuAdminLogin.click();
    await this.waitForPageLoad();
  }

  async isWelcomeTitleVisible(): Promise<boolean> {
    return await this.welcomeTitle.isVisible();
  }

  async getWelcomeTitleText(): Promise<string> {
    return (await this.welcomeTitle.textContent()) || '';
  }

  async isHomepageLoaded(): Promise<boolean> {
    return await this.rooms.isVisible();
  }

  async isContactFormVisible(): Promise<boolean> {
    return await this.contactNameInput.isVisible();
  }

  async selectRoomAndInitiateBooking(roomType: 'Single' | 'Double' | 'Suite'): Promise<void> {
    const roomCard = this.roomCard.filter({ has: this.roomCardTitle.filter({ hasText: roomType }) });

    const bookNowButton = roomCard.locator(this.bookNowButton, { 
      hasText: 'Book now' 
    });

    await bookNowButton.click();
    await this.waitForPageLoad();
  }

  async verifyRoomDetailsPage(expectedRoomTitle: string): Promise<void> {
    const headerText = `${expectedRoomTitle} Room`;
    
    // Verify room title header is visible
    const roomHeader = this.roomDetailsHeader.filter({ hasText: headerText });
    await expect(roomHeader).toBeVisible();

    // Verify Reserve Now button is visible
    const reserveButton = this.reserveNowButton.filter({ hasText: 'Reserve Now' });
    await expect(reserveButton).toBeVisible();
  }

  async getRoomDetailsHeaderText(): Promise<string> {
    return (await this.roomDetailsHeader.textContent()) || '';
  }

  async isReserveNowButtonVisible(): Promise<boolean> {
    return await this.reserveNowButton.isVisible();
  }

  async fillContactForm(contactData: { name: string; email: string; phone: string; subject: string; message: string }): Promise<void> {
    await this.contactNameInput.fill(contactData.name);
    await this.contactEmailInput.fill(contactData.email);
    await this.contactPhoneInput.fill(contactData.phone);
    await this.contactSubjectInput.fill(contactData.subject);
    await this.contactMessageInput.fill(contactData.message);
  }

  async submitContactForm(): Promise<void> {
    const submitButton = this.contactSubmitButton.filter({ hasText: 'Submit' });
    await submitButton.click();
    await this.waitForPageLoad();
  }

  async attemptInvalidContactSubmission(contactData: { name: string; email: string; phone: string; subject: string; message: string }): Promise<void> {
    await this.fillContactForm(contactData);
    await this.submitContactForm();
  }

  getContactFormSuccessElement(fullName: string): Locator {
    const expectedMessage = `Thanks for getting in touch ${fullName}!`;
    return this.contactSuccessMessage.filter({ hasText: expectedMessage });
  }

  getContactFormErrorElement(): Locator {
    return this.contactErrorMessage;
  }
}
