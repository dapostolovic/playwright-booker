import { Page, Locator } from '@playwright/test';
import { UiUtils } from '../utils/ui.utils';
import { config } from '../config/test.config';

export abstract class BasePage {
  protected page: Page;
  public ui: UiUtils;
  
  constructor(page: Page) {
    this.page = page;
    this.ui = new UiUtils(page);
  }

  /**
   * Navigate to the page
   */
  abstract goto(): Promise<void>;

  /**
   * Verify page is loaded
   */
  abstract isLoaded(): Promise<boolean>;

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Refresh the page
   */
  async refresh(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot of the page
   */
  async takeScreenshot(name?: string): Promise<Buffer> {
    const screenshotName = name || `${this.constructor.name}-${Date.now()}`;
    return await this.page.screenshot({ 
      path: `test-results/screenshots/${screenshotName}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for element to be visible
   */
  protected async waitForElement(selector: string, timeout?: number): Promise<Locator> {
    return await this.ui.waitForElement(selector, timeout);
  }

  /**
   * Click element with test step wrapper
   */
  protected async clickElement(selector: string, stepName?: string): Promise<void> {
    if (stepName) {
      // This would be wrapped in test.step in the actual test
      await this.ui.clickElement(selector);
    } else {
      await this.ui.clickElement(selector);
    }
  }

  /**
   * Fill input with test step wrapper
   */
  protected async fillInput(selector: string, value: string, stepName?: string): Promise<void> {
    if (stepName) {
      // This would be wrapped in test.step in the actual test
      await this.ui.fillInput(selector, value);
    } else {
      await this.ui.fillInput(selector, value);
    }
  }

  /**
   * Get element text
   */
  protected async getElementText(selector: string): Promise<string> {
    return await this.ui.getElementText(selector);
  }

  /**
   * Check if element is visible
   */
  protected async isElementVisible(selector: string): Promise<boolean> {
    return await this.ui.isElementVisible(selector);
  }

  /**
   * Scroll to element
   */
  protected async scrollToElement(selector: string): Promise<void> {
    await this.ui.scrollToElement(selector);
  }

  /**
   * Common selectors that might be used across pages
   */
  protected get commonSelectors() {
    return {
      loading: '[data-testid="loading"]',
      error: '[data-testid="error"]',
      success: '[data-testid="success"]',
      modal: '[data-testid="modal"]',
      closeButton: '[data-testid="close-button"]',
      submitButton: '[data-testid="submit-button"]',
      cancelButton: '[data-testid="cancel-button"]'
    };
  }
}
