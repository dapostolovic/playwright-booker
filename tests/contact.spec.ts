import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage';
import { contactFormTestData } from '../src/data/test-data';
import { getInvalidMessageSendExpectedErrorMessage } from '../src/utils/test-helpers';

test.describe('Contact Form Tests', () => {
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    await mainPage.performHomepageNavigation();
  });

  test('Send valid contact message successfully', async () => {
    const validContact = contactFormTestData.generateValidContact();
    
    await mainPage.performValidContactSubmission(validContact);
    await expect(mainPage.getContactFormSuccessElement(validContact.name),'Success message is not displayed').toBeVisible();
  });

  // Data-driven negative tests
  for (const invalidContact of contactFormTestData.generateInvalidContacts()) {
    test(`Contact form shows error for invalid data - ${invalidContact.testName}`, async () => {
      await mainPage.performInvalidContactSubmission(invalidContact);

      const expectedMessage = getInvalidMessageSendExpectedErrorMessage(invalidContact.testName!);
      await expect(mainPage.getContactFormErrorElement(), 'Error message content is incorrect')
        .toContainText(expectedMessage);
    });
  }

  test.describe('Submit contact form with maximum allowed message length', () => {
    test('Maximum subject length', async () => {
      const maxLengthSubjectContact = contactFormTestData.generateMaxLengthContact();
      await mainPage.performValidContactSubmission(maxLengthSubjectContact);
      await expect(mainPage.getContactFormSuccessElement(maxLengthSubjectContact.name),
        'Success message is not displayed for maximum subject length submission').toBeVisible();
    });

    test('Maximum message length', async () => {
      const maxLengthMessageContact = contactFormTestData.generateMaxLengthMessageContact();
      await mainPage.performValidContactSubmission(maxLengthMessageContact);
      await expect(mainPage.getContactFormSuccessElement(maxLengthMessageContact.name),
        'Success message is not displayed for maximum message length submission').toBeVisible();
    });
  });
});
