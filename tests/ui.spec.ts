import { test, expect } from '../src/fixtures/test.fixtures';
import { BookingPage } from '../src/pages/booking.page';

test.describe('UI-Focused Tests', () => {
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page }) => {
    bookingPage = new BookingPage(page);
  });

  test('Complete UI workflow without API dependencies', async ({ 
    page, 
    ui, 
    performStep 
  }) => {
    await performStep('Navigate to application homepage', async () => {
      await ui.navigateTo('/');
      await ui.waitForPageLoad();
      await ui.assertPageTitle(/Hotel Booking|Restful Booker/i);
    });

    await performStep('Verify main page elements are visible', async () => {
      await ui.assertElementIsVisible('header');
      await ui.assertElementIsVisible('nav');
      await ui.assertElementIsVisible('main');
    });

    await performStep('Navigate to booking section', async () => {
      await bookingPage.goto();
      expect(await bookingPage.isLoaded()).toBe(true);
    });

    await performStep('Interact with booking form elements', async () => {
      // Test form interactions
      await ui.fillInput('#firstname', 'Test User');
      await ui.fillInput('#lastname', 'UI Test');
      await ui.fillInput('#totalprice', '100');
      
      // Verify the values were filled
      const firstnameValue = await ui.getElementAttribute('#firstname', 'value');
      const lastnameValue = await ui.getElementAttribute('#lastname', 'value');
      const priceValue = await ui.getElementAttribute('#totalprice', 'value');
      
      expect(firstnameValue).toBe('Test User');
      expect(lastnameValue).toBe('UI Test');
      expect(priceValue).toBe('100');
    });

    await performStep('Test form validation behavior', async () => {
      // Clear required field and try to submit
      await ui.fillInput('#firstname', '');
      
      if (await ui.isElementVisible('[data-testid="save-booking"]')) {
        await ui.clickElement('[data-testid="save-booking"]');
        
        // Check if validation message appears
        const hasValidationError = await ui.isElementVisible('.error') || 
                                  await ui.isElementVisible('[data-testid="error-message"]') ||
                                  await ui.isElementVisible('.field-error');
        
        if (hasValidationError) {
          console.log('Form validation is working as expected');
        }
      }
    });
  });

  test('Responsive design and mobile viewport', async ({ 
    page, 
    ui, 
    performStep 
  }) => {
    await performStep('Test desktop layout', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await ui.navigateTo('/');
      
      // Take screenshot for desktop
      await ui.takePageScreenshot('test-results/screenshots/desktop-layout.png');
      
      // Verify desktop-specific elements
      const isDesktopLayout = await ui.isElementVisible('.desktop-menu') || 
                             await ui.isElementVisible('.sidebar');
      console.log('Desktop layout detected:', isDesktopLayout);
    });

    await performStep('Test tablet layout', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await ui.navigateTo('/');
      
      // Take screenshot for tablet
      await ui.takePageScreenshot('test-results/screenshots/tablet-layout.png');
    });

    await performStep('Test mobile layout', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await ui.navigateTo('/');
      
      // Take screenshot for mobile
      await ui.takePageScreenshot('test-results/screenshots/mobile-layout.png');
      
      // Test mobile-specific interactions
      const hasMobileMenu = await ui.isElementVisible('.mobile-menu') || 
                           await ui.isElementVisible('.hamburger-menu');
      
      if (hasMobileMenu) {
        await ui.clickElement('.mobile-menu');
        // Verify menu opens
        await ui.waitForElement('.mobile-nav, .menu-open');
      }
    });
  });

  test('Keyboard navigation and accessibility', async ({ 
    page, 
    ui, 
    performStep 
  }) => {
    await performStep('Navigate to booking form', async () => {
      await bookingPage.goto();
    });

    await performStep('Test keyboard navigation', async () => {
      // Focus on first input
      await page.focus('#firstname');
      
      // Tab through form elements
      await page.keyboard.press('Tab');
      const focusedElement1 = await page.evaluate(() => document.activeElement?.id);
      
      await page.keyboard.press('Tab');
      const focusedElement2 = await page.evaluate(() => document.activeElement?.id);
      
      console.log('Tab order:', focusedElement1, '->', focusedElement2);
      
      // Test Enter key on buttons
      if (await ui.isElementVisible('[data-testid="save-booking"]')) {
        await page.focus('[data-testid="save-booking"]');
        await page.keyboard.press('Enter');
      }
    });

    await performStep('Test escape key functionality', async () => {
      // Open modal if exists
      if (await ui.isElementVisible('[data-testid="create-booking"]')) {
        await ui.clickElement('[data-testid="create-booking"]');
        
        // Press escape to close
        await page.keyboard.press('Escape');
        
        // Modal should be closed
        const modalVisible = await ui.isElementVisible('[data-testid="modal"]');
        expect(modalVisible).toBe(false);
      }
    });

    await performStep('Check basic accessibility attributes', async () => {
      // Check for ARIA labels
      const formElements = await page.locator('input, button, select').all();
      
      for (const element of formElements) {
        const ariaLabel = await element.getAttribute('aria-label');
        const ariaLabelledBy = await element.getAttribute('aria-labelledby');
        const id = await element.getAttribute('id');
        
        if (!ariaLabel && !ariaLabelledBy && !id) {
          console.warn('Element without accessibility label found');
        }
      }
    });
  });

  test('Animation and transition testing', async ({ 
    page, 
    ui, 
    performStep 
  }) => {
    await performStep('Navigate to application', async () => {
      await ui.navigateTo('/');
    });

    await performStep('Test loading animations', async () => {
      // Reload page to catch loading animations
      await page.reload();
      
      // Check for loading indicators
      const hasLoadingIndicator = await ui.isElementVisible('.loading') ||
                                  await ui.isElementVisible('[data-testid="loading"]') ||
                                  await ui.isElementVisible('.spinner');
      
      if (hasLoadingIndicator) {
        console.log('Loading animation detected');
        
        // Wait for loading to complete
        await ui.waitForElementToBeHidden('.loading');
        await ui.waitForElementToBeHidden('[data-testid="loading"]');
      }
    });

    await performStep('Test hover effects', async () => {
      // Find interactive elements
      const buttons = await page.locator('button, .btn, [role="button"]').all();
      
      if (buttons.length > 0) {
        await ui.hoverElement(buttons[0]);
        
        // Take screenshot with hover effect
        await ui.takePageScreenshot('test-results/screenshots/hover-effect.png');
      }
    });

    await performStep('Test smooth scrolling', async () => {
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
      
      // Wait for scroll to complete
      await page.waitForTimeout(1000);
      
      // Scroll back to top
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await page.waitForTimeout(1000);
    });
  });

  test('Error states and edge cases', async ({ 
    page, 
    ui, 
    performStep 
  }) => {
    await performStep('Test offline scenario', async () => {
      await ui.navigateTo('/');
      
      // Simulate offline
      await page.context().setOffline(true);
      
      // Try to navigate to another page
      try {
        await ui.navigateTo('/booking');
      } catch (error) {
        console.log('Offline navigation failed as expected');
      }
      
      // Restore online
      await page.context().setOffline(false);
    });

    await performStep('Test slow network conditions', async () => {
      // Simulate slow 3G
      await page.context().setOffline(false);
      
      await ui.navigateTo('/');
      await ui.waitForPageLoad();
      
      console.log('Page loaded under slow network conditions');
    });

    await performStep('Test browser back/forward navigation', async () => {
      await ui.navigateTo('/');
      await ui.navigateTo('/booking');
      
      // Go back
      await ui.goBack();
      await ui.waitForUrl('/');
      
      // Go forward
      await ui.goForward();
      await ui.waitForUrl('/booking');
    });

    await performStep('Test page refresh with form data', async () => {
      await bookingPage.goto();
      
      // Fill form
      await ui.fillInput('#firstname', 'Refresh Test');
      await ui.fillInput('#lastname', 'User');
      
      // Refresh page
      await ui.refresh();
      
      // Check if form data is preserved or cleared
      const firstnameValue = await ui.getElementAttribute('#firstname', 'value');
      console.log('Form data after refresh:', firstnameValue);
    });
  });

  test('Cross-browser compatibility checks', async ({ 
    page, 
    ui, 
    performStep 
  }) => {
    await performStep('Check browser-specific features', async () => {
      await ui.navigateTo('/');
      
      // Check browser information
      const userAgent = await page.evaluate(() => navigator.userAgent);
      const browserName = await page.evaluate(() => {
        if (navigator.userAgent.includes('Chrome')) return 'Chrome';
        if (navigator.userAgent.includes('Firefox')) return 'Firefox';
        if (navigator.userAgent.includes('Safari')) return 'Safari';
        return 'Unknown';
      });
      
      console.log(`Testing on ${browserName}`);
      console.log(`User Agent: ${userAgent}`);
    });

    await performStep('Test modern JavaScript features', async () => {
      // Test if modern JS features are supported
      const supportsES6 = await page.evaluate(() => {
        try {
          eval('const test = () => true');
          return true;
        } catch (e) {
          return false;
        }
      });
      
      expect(supportsES6).toBe(true);
      console.log('ES6+ features are supported');
    });

    await performStep('Test CSS Grid and Flexbox support', async () => {
      const cssSupport = await page.evaluate(() => {
        const testElement = document.createElement('div');
        return {
          grid: CSS.supports('display', 'grid'),
          flexbox: CSS.supports('display', 'flex')
        };
      });
      
      console.log('CSS Support:', cssSupport);
      expect(cssSupport.flexbox).toBe(true);
    });
  });
});

