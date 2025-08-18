import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { BookingData, ContactFormData } from '../types/common.types';

export interface RoomBookingData {
  roomType: string;
  roomTitle: string;
  isReserveButtonVisible: boolean;
}

export interface ContactFormValidation {
  firstname: { required: true };
  lastname: { required: true };
  email: { required: true; format: 'email' };
  phone: { required: true; format: 'phone' };
  subject: { required: true; minLength: 5; maxLength: 100 };
  message: { required: true; minLength: 20; maxLength: 2000 };
}

/**
 * Test data for contact form scenarios
 */
export const contactFormTestData = {
  validContact: {
    name: 'John Doe',  // Keep single name field
    email: 'john.doe@example.com',
    phone: '+1234567890',
    subject: 'Inquiry about room booking',
    message: 'I would like to inquire about availability for a single room for next weekend. Please let me know the rates and availability.'
  },
  
  invalidContacts: {
    emptyName: {
      name: '',  // Keep single name field
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Valid subject here',
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.'
    },
    
    invalidEmail: {
      name: 'John',
      email: 'invalid-email-format',
      phone: '+1234567890',
      subject: 'Valid subject here',
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.'
    },
    
    shortSubject: {
      name: 'John',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Hi',  // Too short (less than 5 characters)
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement.'
    },
    
    shortMessage: {
      name: 'John',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Valid subject here',
      message: 'Too short'  // Less than 20 characters
    }
  },
  
  edgeCases: {
    maxLengthSubject: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'A'.repeat(100),  // Exactly 100 characters (max allowed)
      message: 'This is a valid message with more than twenty characters to meet the minimum requirement for testing.'
    },
    
    maxLengthMessage: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      subject: 'Testing maximum message length',
      message: 'A'.repeat(2000)  // Exactly 2000 characters (max allowed)
    }
  }
};

export class BookingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Page selectors
  private get selectors() {
    return {
      // Form fields
      firstNameInput: '#firstname',
      lastNameInput: '#lastname',
      totalPriceInput: '#totalprice',
      depositPaidCheckbox: '#depositpaid',
      checkInInput: '#checkin',
      checkOutInput: '#checkout',
      additionalNeedsInput: '#additionalneeds',
      
      // Buttons
      saveButton: '[data-testid="save-booking"]',
      updateButton: '[data-testid="update-booking"]',
      deleteButton: '[data-testid="delete-booking"]',
      cancelButton: '[data-testid="cancel-booking"]',
      
      // Display elements
      bookingsList: '[data-testid="bookings-list"]',
      bookingItem: '[data-testid="booking-item"]',
      bookingDetails: '[data-testid="booking-details"]',
      
      // Messages
      successMessage: '[data-testid="success-message"]',
      errorMessage: '[data-testid="error-message"]',
      
      // Navigation
      createBookingButton: '[data-testid="create-booking"]',
      editBookingButton: '[data-testid="edit-booking"]',
      viewBookingButton: '[data-testid="view-booking"]',
      
      // Room selection selectors
      rooms: '#rooms',
      roomCard: '.room-card',
      roomCardTitle: '.card-title',
      bookNowButton: 'a.btn.btn-primary',
      
      // Room details page selectors
      roomDetailsHeader: 'h1.fw-bold.mb-2',
      reserveNowButton: 'button#doReservation',
      
      // Room-specific combinations
      singleRoomCard: '.room-card:has(.card-title:text("Single"))',
      doubleRoomCard: '.room-card:has(.card-title:text("Double"))',
      suiteRoomCard: '.room-card:has(.card-title:text("Suite"))',
      
      // Contact form selectors
      contactNameInput: '[data-testid="ContactName"]',
      contactEmailInput: '[data-testid="ContactEmail"]',
      contactPhoneInput: '[data-testid="ContactPhone"]',
      contactSubjectInput: '[data-testid="ContactSubject"]',
      contactMessageInput: '[data-testid="ContactDescription"]',
      contactSubmitButton: 'button.btn.btn-primary',
      
      // Contact form messages
      contactSuccessMessage: 'h3.h4.mb-4',
      contactErrorMessage: '.alert.alert-danger'
    };
  }

  /**
   * Navigate to booking page
   */
  async goto(): Promise<void> {
    await this.ui.navigateTo('/booking');
    await this.waitForPageLoad();
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.bookingsList);
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData: Omit<BookingData, 'id'>): Promise<void> {
    await this.clickElement(this.selectors.createBookingButton);
    await this.fillBookingForm(bookingData);
    await this.clickElement(this.selectors.saveButton);
    await this.waitForSuccessMessage();
  }

  /**
   * Fill booking form with data
   */
  async fillBookingForm(bookingData: Omit<BookingData, 'id'>): Promise<void> {
    await this.fillInput(this.selectors.firstNameInput, bookingData.firstname);
    await this.fillInput(this.selectors.lastNameInput, bookingData.lastname);
    await this.fillInput(this.selectors.totalPriceInput, bookingData.totalprice.toString());
    
    if (bookingData.depositpaid) {
      await this.ui.checkCheckbox(this.selectors.depositPaidCheckbox);
    } else {
      await this.ui.uncheckCheckbox(this.selectors.depositPaidCheckbox);
    }
    
    await this.fillInput(this.selectors.checkInInput, bookingData.bookingdates.checkin);
    await this.fillInput(this.selectors.checkOutInput, bookingData.bookingdates.checkout);
    
    if (bookingData.additionalneeds) {
      await this.fillInput(this.selectors.additionalNeedsInput, bookingData.additionalneeds);
    }
  }

  /**
   * Update an existing booking
   */
  async updateBooking(bookingId: number, updateData: Partial<BookingData>): Promise<void> {
    await this.selectBooking(bookingId);
    await this.clickElement(this.selectors.editBookingButton);
    
    // Fill only the fields that need to be updated
    if (updateData.firstname) {
      await this.fillInput(this.selectors.firstNameInput, updateData.firstname);
    }
    if (updateData.lastname) {
      await this.fillInput(this.selectors.lastNameInput, updateData.lastname);
    }
    if (updateData.totalprice !== undefined) {
      await this.fillInput(this.selectors.totalPriceInput, updateData.totalprice.toString());
    }
    if (updateData.depositpaid !== undefined) {
      if (updateData.depositpaid) {
        await this.ui.checkCheckbox(this.selectors.depositPaidCheckbox);
      } else {
        await this.ui.uncheckCheckbox(this.selectors.depositPaidCheckbox);
      }
    }
    if (updateData.bookingdates?.checkin) {
      await this.fillInput(this.selectors.checkInInput, updateData.bookingdates.checkin);
    }
    if (updateData.bookingdates?.checkout) {
      await this.fillInput(this.selectors.checkOutInput, updateData.bookingdates.checkout);
    }
    if (updateData.additionalneeds) {
      await this.fillInput(this.selectors.additionalNeedsInput, updateData.additionalneeds);
    }
    
    await this.clickElement(this.selectors.updateButton);
    await this.waitForSuccessMessage();
  }

  /**
   * Delete a booking
   */
  async deleteBooking(bookingId: number): Promise<void> {
    await this.selectBooking(bookingId);
    await this.clickElement(this.selectors.deleteButton);
    
    // Handle confirmation dialog if present
    await this.ui.handleDialog(true);
    await this.waitForSuccessMessage();
  }

  /**
   * Select a booking from the list
   */
  async selectBooking(bookingId: number): Promise<void> {
    const bookingSelector = `${this.selectors.bookingItem}[data-booking-id="${bookingId}"]`;
    await this.clickElement(bookingSelector);
  }

  /**
   * Get booking details from UI
   */
  async getBookingDetails(bookingId: number): Promise<BookingData | null> {
    try {
      await this.selectBooking(bookingId);
      await this.clickElement(this.selectors.viewBookingButton);
      
      const firstname = await this.getElementText(`${this.selectors.bookingDetails} [data-field="firstname"]`);
      const lastname = await this.getElementText(`${this.selectors.bookingDetails} [data-field="lastname"]`);
      const totalprice = parseInt(await this.getElementText(`${this.selectors.bookingDetails} [data-field="totalprice"]`));
      const depositpaid = await this.getElementText(`${this.selectors.bookingDetails} [data-field="depositpaid"]`) === 'true';
      const checkin = await this.getElementText(`${this.selectors.bookingDetails} [data-field="checkin"]`);
      const checkout = await this.getElementText(`${this.selectors.bookingDetails} [data-field="checkout"]`);
      const additionalneeds = await this.getElementText(`${this.selectors.bookingDetails} [data-field="additionalneeds"]`);
      
      return {
        id: bookingId,
        firstname,
        lastname,
        totalprice,
        depositpaid,
        bookingdates: { checkin, checkout },
        additionalneeds
      };
    } catch (error) {
      console.error('Failed to get booking details:', error);
      return null;
    }
  }

  /**
   * Get all bookings from the list
   */
  async getAllBookingsFromUI(): Promise<number[]> {
    const bookingElements = await this.ui.getAllElements(this.selectors.bookingItem);
    const bookingIds: number[] = [];
    
    for (const element of bookingElements) {
      const bookingId = await element.getAttribute('data-booking-id');
      if (bookingId) {
        bookingIds.push(parseInt(bookingId));
      }
    }
    
    return bookingIds;
  }

  /**
   * Wait for success message to appear
   */
  async waitForSuccessMessage(): Promise<void> {
    await this.ui.waitForElement(this.selectors.successMessage);
  }

  /**
   * Wait for error message to appear
   */
  async waitForErrorMessage(): Promise<void> {
    await this.ui.waitForElement(this.selectors.errorMessage);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getElementText(this.selectors.successMessage);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.selectors.errorMessage);
  }

  /**
   * Check if booking exists in the list
   */
  async isBookingInList(bookingId: number): Promise<boolean> {
    const bookingSelector = `${this.selectors.bookingItem}[data-booking-id="${bookingId}"]`;
    return await this.isElementVisible(bookingSelector);
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.fillInput(this.selectors.firstNameInput, '');
    await this.fillInput(this.selectors.lastNameInput, '');
    await this.fillInput(this.selectors.totalPriceInput, '');
    await this.ui.uncheckCheckbox(this.selectors.depositPaidCheckbox);
    await this.fillInput(this.selectors.checkInInput, '');
    await this.fillInput(this.selectors.checkOutInput, '');
    await this.fillInput(this.selectors.additionalNeedsInput, '');
  }

  /**
   * Navigate to booking homepage (room selection page)
   */
  async gotoHomepage(): Promise<void> {
    await this.ui.navigateTo('/');
    await this.waitForPageLoad();
  }

  /**
   * Check if homepage with room cards is loaded
   */
  async isHomepageLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.rooms);
  }

  /**
   * Select a room by type and initiate booking
   */
  async selectRoomAndInitiateBooking(roomType: 'Single' | 'Double' | 'Suite'): Promise<void> {
    const roomCard = this.page.locator(this.selectors.roomCard, {
      has: this.page.locator(this.selectors.roomCardTitle, { hasText: roomType })
    });

    const bookNowButton = roomCard.locator(this.selectors.bookNowButton, { 
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
    const roomHeader = this.page.locator(this.selectors.roomDetailsHeader, { 
      hasText: headerText 
    });
    await expect(roomHeader).toBeVisible();

    // Verify Reserve Now button is visible
    const reserveButton = this.page.locator(this.selectors.reserveNowButton, { 
      hasText: 'Reserve Now' 
    });
    await expect(reserveButton).toBeVisible();
  }

  /**
   * Get room card by type
   */
  async getRoomCard(roomType: 'Single' | 'Double' | 'Suite'): Promise<Locator> {
    return this.page.locator(this.selectors.roomCard, {
      has: this.page.locator(this.selectors.roomCardTitle, { hasText: roomType })
    });
  }

  /**
   * Check if Reserve Now button is visible
   */
  async isReserveNowButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(`${this.selectors.reserveNowButton}:text("Reserve Now")`);
  }

  /**
   * Get room details header text
   */
  async getRoomDetailsHeaderText(): Promise<string> {
    return await this.getElementText(this.selectors.roomDetailsHeader);
  }

  /**
   * Click Reserve Now button
   */
  async clickReserveNow(): Promise<void> {
    await this.clickElement(`${this.selectors.reserveNowButton}:text("Reserve Now")`);
  }

  /**
   * Fill contact form with provided data
   */
  async fillContactForm(contactData: ContactFormData): Promise<void> {
    await this.fillInput(this.selectors.contactNameInput, contactData.name);  // Single name field
    await this.fillInput(this.selectors.contactEmailInput, contactData.email);
    await this.fillInput(this.selectors.contactPhoneInput, contactData.phone);
    await this.fillInput(this.selectors.contactSubjectInput, contactData.subject);
    await this.fillInput(this.selectors.contactMessageInput, contactData.message);
  }

  /**
   * Submit contact form
   */
  async submitContactForm(): Promise<void> {
    const submitButton = this.page.locator(this.selectors.contactSubmitButton, { 
      hasText: 'Submit' 
    });
    await submitButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Fill and submit contact form
   */
  async fillAndSubmitContactForm(contactData: ContactFormData): Promise<void> {
    await this.fillContactForm(contactData);
    await this.submitContactForm();
  }

  /**
   * Verify contact form success message with dynamic name
   */
  async verifyContactFormSuccess(fullName: string): Promise<void> {
    const expectedMessage = `Thanks for getting in touch ${fullName}!`;
    const successMessage = this.page.locator(this.selectors.contactSuccessMessage, {
      hasText: expectedMessage
    });
    await expect(successMessage).toBeVisible();
  }

  /**
   * Verify contact form error message
   */
  async verifyContactFormError(): Promise<void> {
    const errorMessage = this.page.locator(this.selectors.contactErrorMessage);
    await expect(errorMessage).toBeVisible();
  }

  /**
   * Check if contact form is visible
   */
  async isContactFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.selectors.contactNameInput);
  }

  /**
   * Clear contact form
   */
  async clearContactForm(): Promise<void> {
    await this.fillInput(this.selectors.contactNameInput, '');  // Single name field
    await this.fillInput(this.selectors.contactEmailInput, '');
    await this.fillInput(this.selectors.contactPhoneInput, '');
    await this.fillInput(this.selectors.contactSubjectInput, '');
    await this.fillInput(this.selectors.contactMessageInput, '');
  }

  /**
   * Get contact form error message text
   */
  async getContactFormErrorText(): Promise<string> {
    return await this.getElementText(this.selectors.contactErrorMessage);
  }

  /**
   * Get contact form success message text
   */
  async getContactFormSuccessText(): Promise<string> {
    return await this.getElementText(this.selectors.contactSuccessMessage);
  }
}
