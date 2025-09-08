import { Locator, test } from '@playwright/test';
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
  readonly menuAdminLogin: Locator;

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
    this.menuAdminLogin = page.locator('a.nav-link[href="/admin"]'); 
  }

  async gotoMainPage() {
    await test.step('Navigate to homepage', async () => {
      await this.navigateTo('/');
      await this.waitForPageLoad();
    });
  }

  async navigateToAdminLogin() {
    await test.step('Navigate to admin login page', async () => {
      await this.menuAdminLogin.click();
      await this.waitForPageLoad();
    });
  }

  async isWelcomeTitleVisible(): Promise<boolean> {
    return await test.step('Verify welcome title is visible', async () => {
      return await this.welcomeTitle.isVisible();
    });
  }

  async getWelcomeTitleText(): Promise<string> {
    return await test.step('Get welcome title text', async () => {
      return (await this.welcomeTitle.textContent()) || '';
    });
  }

  async isHomepageLoaded(): Promise<boolean> {
    return await this.rooms.isVisible();
  }

  async isContactFormVisible(): Promise<boolean> {
    return await this.contactNameInput.isVisible();
  }

  async selectRoomAndInitiateBooking(roomType: 'Single' | 'Double' | 'Suite'): Promise<void> {
    await test.step(`Select a ${roomType} room and initiate booking`, async () => {
      const roomCard = this.roomCard.filter({ has: this.roomCardTitle.filter({ hasText: roomType }) });

      const bookNowButton = roomCard.locator(this.bookNowButton, { 
        hasText: 'Book now' 
      });

      await bookNowButton.click();
      await this.waitForPageLoad();
    });
  }

  async getRoomDetailsHeaderLocator(expectedRoomTitle: string): Promise<Locator> {
    const headerText = `${expectedRoomTitle} Room`;
    return await test.step('Get room details header locator', async () => {
      return this.roomDetailsHeader.filter({ hasText: headerText });
    });
  }

  async getReserveNowButtonLocator(): Promise<Locator> {
    return await test.step('Get reserve now button locator', async () => {
      return this.reserveNowButton.filter({ hasText: 'Reserve Now' });
    });
  }

  async getRoomDetailsHeaderText(): Promise<string> {
    return await test.step('Get room details header text', async () => {
      return (await this.roomDetailsHeader.textContent()) || '';
    });
  }

  async isReserveNowButtonVisible(): Promise<boolean> {
    return await test.step('Verify reserve now button is visible', async () => {  
      return await this.reserveNowButton.isVisible();
    });
  }

  async fillContactForm(contactData: { name: string; email: string; phone: string; subject: string; message: string }): Promise<void> {
    await test.step('Fill contact form', async () => {
      await this.contactNameInput.fill(contactData.name);
      await this.contactEmailInput.fill(contactData.email);
      await this.contactPhoneInput.fill(contactData.phone);
      await this.contactSubjectInput.fill(contactData.subject);
      await this.contactMessageInput.fill(contactData.message);
    });
  }

  async submitContactForm(): Promise<void> {
    await test.step('Submit contact form', async () => {
      const submitButton = this.contactSubmitButton.filter({ hasText: 'Submit' });
      await submitButton.click();
      await this.waitForPageLoad();
    });
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

  async performHomepageNavigation(): Promise<void> {
    await this.gotoMainPage();
  }

  async performValidContactSubmission(contactData: { name: string; email: string; phone: string; subject: string; message: string }): Promise<void> {
    await this.fillContactForm(contactData);
    await this.submitContactForm();
  }

  async performInvalidContactSubmission(contactData: { name: string; email: string; phone: string; subject: string; message: string }): Promise<void> {
    await this.fillContactForm(contactData);
    await this.submitContactForm();
  }
}
