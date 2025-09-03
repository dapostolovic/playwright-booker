import { Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForTimeout(500);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }
}