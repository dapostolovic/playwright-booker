import { test, expect } from '../src/fixtures/test.fixtures';
import { BookingPage } from '../src/pages/booking.page';
import { contactFormTestData } from '../src/data/test-data';

test.describe('Contact Form Tests', () => {
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page, ui }) => {
    bookingPage = new BookingPage(page);
    
    await test.step('Navigate to homepage with contact form', async () => {
      await bookingPage.gotoHomepage();
      expect(await bookingPage.isHomepageLoaded()).toBe(true);
      expect(await bookingPage.isContactFormVisible()).toBe(true);
    });
  });

  test('Send valid contact message successfully', async ({ performStep }) => {
    const validContact = contactFormTestData.validContact;

    await performStep('Fill contact form with valid data', async () => {
      await bookingPage.fillContactForm(validContact);
    });

    await performStep('Submit contact form', async () => {
      await bookingPage.submitContactForm();
    });

    await performStep('Verify success message with correct name is displayed', async () => {
      await bookingPage.verifyContactFormSuccess(validContact.name);
    });
  });

  test('Contact form shows error for invalid data - Empty name', async ({ performStep }) => {
    const invalidContact = contactFormTestData.invalidContacts.emptyName;

    await performStep('Fill contact form with empty name', async () => {
      await bookingPage.fillContactForm(invalidContact);
    });

    await performStep('Submit contact form', async () => {
      await bookingPage.submitContactForm();
    });

    await performStep('Verify error message is displayed', async () => {
      await bookingPage.verifyContactFormError();
    });
  });

  test('Contact form shows error for invalid data - Invalid email', async ({ performStep }) => {
    const invalidContact = contactFormTestData.invalidContacts.invalidEmail;

    await performStep('Fill contact form with invalid email format', async () => {
      await bookingPage.fillContactForm(invalidContact);
    });

    await performStep('Submit contact form', async () => {
      await bookingPage.submitContactForm();
    });

    await performStep('Verify error message is displayed', async () => {
      await bookingPage.verifyContactFormError();
    });
  });

  test('Contact form shows error for invalid data - Short subject', async ({ performStep }) => {
    const invalidContact = contactFormTestData.invalidContacts.shortSubject;

    await performStep('Fill contact form with subject too short (less than 5 characters)', async () => {
      await bookingPage.fillContactForm(invalidContact);
    });

    await performStep('Submit contact form', async () => {
      await bookingPage.submitContactForm();
    });

    await performStep('Verify error message is displayed', async () => {
      await bookingPage.verifyContactFormError();
    });
  });

  test('Contact form shows error for invalid data - Short message', async ({ performStep }) => {
    const invalidContact = contactFormTestData.invalidContacts.shortMessage;

    await performStep('Fill contact form with message too short (less than 20 characters)', async () => {
      await bookingPage.fillContactForm(invalidContact);
    });

    await performStep('Submit contact form', async () => {
      await bookingPage.submitContactForm();
    });

    await performStep('Verify error message is displayed', async () => {
      await bookingPage.verifyContactFormError();
    });
  });

  test.describe('Contact Form Edge Cases', () => {
    test('Submit contact form with maximum allowed character limits', async ({ performStep }) => {
      const maxLengthContact = contactFormTestData.edgeCases.maxLengthSubject;

      await performStep('Fill contact form with maximum length subject', async () => {
        await bookingPage.fillContactForm(maxLengthContact);
      });

      await performStep('Submit contact form', async () => {
        await bookingPage.submitContactForm();
      });

      await performStep('Verify form submission is successful', async () => {
        await bookingPage.verifyContactFormSuccess(maxLengthContact.name);
      });
    });
  });
});
