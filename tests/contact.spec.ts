import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { contactFormTestData } from '../src/data/test-data';

test.describe('Contact Form Tests', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    
    await test.step('Navigate to homepage with contact form', async () => {
      await mainPage.gotoMainPage();
      expect(await mainPage.isHomepageLoaded()).toBe(true);
      expect(await mainPage.isContactFormVisible()).toBe(true);
    });
  });

  test('Send valid contact message successfully', async () => {
    const validContact = contactFormTestData.validContact;
    await mainPage.fillContactForm(validContact);
    await mainPage.submitContactForm();
    await mainPage.verifyContactFormSuccess(validContact.name);
  });

  // Data-driven negative tests
  for (const invalidContact of contactFormTestData.invalidContacts) {
    test(`Contact form shows error for invalid data - ${invalidContact.testName}`, async () => {
      await test.step(`Fill contact form with invalid data: ${invalidContact.testName}`, async () => {
        await mainPage.fillContactForm(invalidContact);
      });

      await test.step('Submit contact form', async () => {
        await mainPage.submitContactForm();
      });

      await test.step('Verify error message is displayed', async () => {
        await mainPage.verifyContactFormError();
      });
    });
  }

  test('Submit contact form with maximum allowed character limits', async () => {
    const maxLengthContact = contactFormTestData.edgeCases.maxLengthSubject;
    await mainPage.fillContactForm(maxLengthContact);
    await mainPage.submitContactForm();
    await mainPage.verifyContactFormSuccess(maxLengthContact.name);
  });
});
