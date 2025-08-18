import { Page, Locator, expect } from '@playwright/test';
import { config } from '../config/test.config';

export class UiUtils {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   */
  async navigateTo(path: string = ''): Promise<void> {
    const url = path.startsWith('http') ? path : `${config.baseUrl}${path}`;
    await this.page.goto(url);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout?: number): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ 
      state: 'visible', 
      timeout: timeout || config.actionTimeout 
    });
    return element;
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementToBeHidden(selector: string, timeout?: number): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ 
      state: 'hidden', 
      timeout: timeout || config.actionTimeout 
    });
  }

  /**
   * Click element with wait
   */
  async clickElement(selector: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    const element = await this.waitForElement(selector, options?.timeout);
    await element.click({ force: options?.force });
  }

  /**
   * Fill input field
   */
  async fillInput(selector: string, value: string, options?: { clear?: boolean; timeout?: number }): Promise<void> {
    const element = await this.waitForElement(selector, options?.timeout);
    
    if (options?.clear !== false) {
      await element.clear();
    }
    
    await element.fill(value);
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string | { label?: string; value?: string; index?: number }): Promise<void> {
    const element = await this.waitForElement(selector);
    
    if (typeof value === 'string') {
      await element.selectOption(value);
    } else if (value.value) {
      await element.selectOption({ value: value.value });
    } else if (value.label) {
      await element.selectOption({ label: value.label });
    } else if (value.index !== undefined) {
      await element.selectOption({ index: value.index });
    }
  }

  /**
   * Get text content of element
   */
  async getElementText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.textContent() || '';
  }

  /**
   * Get attribute value of element
   */
  async getElementAttribute(selector: string, attribute: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.getAttribute(attribute) || '';
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
   * Check if element exists (not necessarily visible)
   */
  async doesElementExist(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'attached', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Take screenshot of specific element
   */
  async takeElementScreenshot(selector: string, path: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.screenshot({ path });
  }

  /**
   * Take full page screenshot
   */
  async takePageScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }

  /**
   * Wait for text to appear
   */
  async waitForText(text: string, timeout?: number): Promise<void> {
    await this.page.waitForFunction(
      (searchText) => document.body.innerText.includes(searchText),
      text,
      { timeout: timeout || config.actionTimeout }
    );
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForUrl(pattern: string | RegExp, timeout?: number): Promise<void> {
    await this.page.waitForURL(pattern, { timeout: timeout || config.navigationTimeout });
  }

  /**
   * Execute JavaScript in browser context
   */
  async executeScript<T>(script: string, ...args: any[]): Promise<T> {
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Handle dialog (alert, confirm, prompt)
   */
  async handleDialog(accept: boolean = true, text?: string): Promise<void> {
    this.page.on('dialog', async dialog => {
      if (text) {
        await dialog.accept(text);
      } else if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Upload file
   */
  async uploadFile(selector: string, filePath: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.setInputFiles(filePath);
  }

  /**
   * Hover over element
   */
  async hoverElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.hover();
  }

  /**
   * Double click element
   */
  async doubleClickElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.dblclick();
  }

  /**
   * Right click element
   */
  async rightClickElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.click({ button: 'right' });
  }

  /**
   * Check checkbox
   */
  async checkCheckbox(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.check();
  }

  /**
   * Uncheck checkbox
   */
  async uncheckCheckbox(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.uncheck();
  }

  /**
   * Get all elements matching selector
   */
  async getAllElements(selector: string): Promise<Locator[]> {
    const elements = this.page.locator(selector);
    const count = await elements.count();
    const locators: Locator[] = [];
    
    for (let i = 0; i < count; i++) {
      locators.push(elements.nth(i));
    }
    
    return locators;
  }

  /**
   * Assert element text contains expected text
   */
  async assertElementTextContains(selector: string, expectedText: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await expect(element).toContainText(expectedText);
  }

  /**
   * Assert element is visible
   */
  async assertElementIsVisible(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible();
  }

  /**
   * Assert element is hidden
   */
  async assertElementIsHidden(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await expect(element).toBeHidden();
  }

  /**
   * Assert page title
   */
  async assertPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Assert page URL
   */
  async assertPageUrl(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }
}
