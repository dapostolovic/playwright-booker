import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { contactFormTestData } from '../src/data/test-data';

test.describe('Contact Form Tests', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    
    await test.step('Navigate to homepage with contact form', async () => {
      await mainPage.gotoMainPage();
    });
    
    await test.step('Verify homepage and contact form are loaded', async () => {
      expect(await mainPage.isHomepageLoaded()).toBe(true);
      expect(await mainPage.isContactFormVisible()).toBe(true);
    });
  });

  test('Send valid contact message successfully', async () => {
    const validContact = contactFormTestData.validContact;
    
    await test.step('Fill contact form with valid data', async () => {
      await mainPage.fillContactForm(validContact);
    });
    
    await test.step('Submit contact form', async () => {
      await mainPage.submitContactForm();
    });
    
    await test.step('Verify success message is displayed', async () => {
      await expect(mainPage.getContactFormSuccessElement(validContact.name)).toBeVisible({ timeout: 500 });
    });
  });

  // Data-driven negative tests
  for (const invalidContact of contactFormTestData.invalidContacts) {
    test(`Contact form shows error for invalid data - ${invalidContact.testName}`, async () => {
      await test.step('Attempt to submit contact form with invalid data', async () => {
        await mainPage.attemptInvalidContactSubmission(invalidContact);
      });
      
      await test.step('Verify error message is displayed', async () => {
        await expect(mainPage.getContactFormErrorElement()).toBeVisible({ timeout: 500 });
      });
    });
  }

  test('Submit contact form with maximum allowed character limits', async () => {
    const maxLengthContact = contactFormTestData.edgeCases.maxLengthSubject;
    
    await test.step('Fill contact form with maximum length data', async () => {
      await mainPage.fillContactForm(maxLengthContact);
    });
    
    await test.step('Submit contact form with maximum length data', async () => {
      await mainPage.submitContactForm();
    });
    
    await test.step('Verify success message is displayed for maximum length submission', async () => {
      await expect(mainPage.getContactFormSuccessElement(maxLengthContact.name)).toBeVisible({ timeout: 500 });
    });
  });
});
