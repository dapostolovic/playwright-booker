import { Page } from '@playwright/test';
import { config } from '../config/test.config';

/**
 * Test helper utilities for common testing operations
 */
export class TestHelpers {
  
  /**
   * Wait for a specific amount of time
   */
  static async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Generate a unique identifier for test data
   */
  static generateUniqueId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a timestamp string
   */
  static getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Clean up string for file names
   */
  static sanitizeFileName(name: string): string {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  /**
   * Get formatted date string
   */
  static getFormattedDate(daysFromNow: number = 0): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  }

  /**
   * Generate random number within range
   */
  static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random string of specified length
   */
  static getRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email address
   */
  static getRandomEmail(): string {
    const domains = ['example.com', 'test.com', 'demo.org'];
    const username = this.getRandomString(8);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
  }

  /**
   * Retry an operation with exponential backoff
   */
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const waitTime = delay * Math.pow(2, attempt - 1);
          console.log(`Retry attempt ${attempt}/${maxRetries} failed, waiting ${waitTime}ms...`);
          await this.wait(waitTime);
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Execute operation with timeout
   */
  static async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number = config.actionTimeout
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
    });

    return Promise.race([operation(), timeoutPromise]);
  }

  /**
   * Deep merge two objects
   */
  static deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {} as T[Extract<keyof T, string>], source[key]);
      } else {
        result[key] = source[key]!;
      }
    }
    
    return result;
  }

  /**
   * Check if value is empty (null, undefined, empty string, empty array, empty object)
   */
  static isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * Format currency value
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Parse date string to Date object
   */
  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Check if date is in the future
   */
  static isFutureDate(dateString: string): boolean {
    return this.parseDate(dateString) > new Date();
  }

  /**
   * Get difference between two dates in days
   */
  static getDateDifferenceInDays(date1: string, date2: string): number {
    const d1 = this.parseDate(date1);
    const d2 = this.parseDate(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Take screenshot with custom name
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = this.getTimestamp();
    const fileName = `${this.sanitizeFileName(name)}_${timestamp}.png`;
    await page.screenshot({
      path: `test-results/screenshots/${fileName}`,
      fullPage: true
    });
  }

  /**
   * Log test step information
   */
  static logStep(stepName: string, details?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 📋 Step: ${stepName}`);
    if (details) {
      console.log(`[${timestamp}] 📝 Details:`, details);
    }
  }

  /**
   * Create test data cleanup function
   */
  static createCleanupFunction(cleanupActions: (() => Promise<void>)[]): () => Promise<void> {
    return async () => {
      console.log('🧹 Running cleanup actions...');
      
      for (const action of cleanupActions) {
        try {
          await action();
        } catch (error) {
          console.error('⚠️ Cleanup action failed:', error);
        }
      }
      
      console.log('✅ Cleanup completed');
    };
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (basic)
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[^\d\+]/g, ''));
  }

  /**
   * Generate test report metadata
   */
  static generateTestMetadata(testName: string): any {
    return {
      testName,
      timestamp: new Date().toISOString(),
      environment: {
        baseUrl: config.baseUrl,
        browser: process.env.BROWSER || 'chromium',
        viewport: `${config.viewport.width}x${config.viewport.height}`,
        headless: config.headless
      },
      configuration: {
        timeout: config.testTimeout,
        retries: config.retries,
        workers: config.workers
      }
    };
  }

  /**
   * Convert object to URL query string
   */
  static objectToQueryString(obj: Record<string, any>): string {
    const params = new URLSearchParams();
    
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        params.append(key, String(value));
      }
    }
    
    return params.toString();
  }

  /**
   * Extract numbers from string
   */
  static extractNumbers(text: string): number[] {
    const matches = text.match(/\d+/g);
    return matches ? matches.map(Number) : [];
  }

  /**
   * Capitalize first letter of each word
   */
  static toTitleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
}
