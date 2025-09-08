import { Page } from '@playwright/test';
import { Routes } from '../src/config/routes';

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

  async waitForRedirect(targetRoute?: string): Promise<void> {
    const route = targetRoute || Routes.home;
    // Wait for URL to change to target route
    await this.page.waitForURL(`**${route}`, { timeout: 10000 });
  }
}