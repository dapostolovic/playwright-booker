# Playwright Booker - TypeScript Testing Framework

A comprehensive Playwright testing framework built with TypeScript for testing demo applications. Features dual reporting (HTML + Allure), API and UI testing capabilities, centralized configuration, and proper test organization with step-by-step execution tracking.

## 🚀 Features

- **Dual Reporting**: Native Playwright HTML reports + Allure reports with trend analysis
- **Hybrid Testing**: Support for both API and UI testing in the same test suite
- **Centralized Configuration**: Single source of truth for all test settings
- **Test Steps**: Uses `test.step()` for granular reporting and better readability
- **Screenshots & Videos**: Automatic capture on failures with full traceability
- **Custom Fixtures**: Pre-built utilities for API and UI interactions
- **Page Object Model**: Organized page objects for maintainable UI tests
- **TypeScript**: Full TypeScript support with proper typing
- **Cross-browser**: Support for Chromium, Firefox, and WebKit
- **Mobile Testing**: Responsive design testing across different viewports

## 📁 Project Structure

```
playwright-booker/
├── src/
│   ├── config/
│   │   └── test.config.ts          # Centralized configuration
│   ├── fixtures/
│   │   └── test.fixtures.ts        # Custom Playwright fixtures
│   ├── pages/
│   │   ├── base.page.ts           # Base page object class
│   │   └── booking.page.ts        # Booking-specific page object
│   ├── types/
│   │   └── common.types.ts        # TypeScript type definitions
│   └── utils/
│       ├── api.utils.ts           # API testing utilities
│       └── ui.utils.ts            # UI testing utilities
├── tests/
│   ├── auth.spec.ts               # Authentication tests
│   ├── booking.spec.ts            # Booking management tests
│   └── ui.spec.ts                 # UI-focused tests
├── test-results/                  # Test execution results
├── playwright-report/             # HTML reports
├── allure-results/               # Allure raw results
├── allure-report/                # Allure generated reports
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or create the project**:
   ```bash
   mkdir playwright-booker
   cd playwright-booker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

4. **Set up environment configuration**:
   ```bash
   cp env.config.example .env
   # Edit .env file with your specific settings
   ```

5. **Install Allure (for trend reporting)**:
   ```bash
   npm install -g allure-commandline
   ```

## ⚙️ Configuration

### Environment Variables

Copy `env.config.example` to `.env` and modify the values:

```env
# Base URLs
BASE_URL=http://localhost
API_BASE_URL=http://localhost/api

# Timeouts (milliseconds)
ACTION_TIMEOUT=10000
NAVIGATION_TIMEOUT=30000
TEST_TIMEOUT=60000

# Test execution settings
RETRIES=0
WORKERS=4
HEADLESS=true

# Default test user credentials
DEFAULT_USERNAME=testuser
DEFAULT_PASSWORD=testpass
DEFAULT_EMAIL=test@example.com
```

### Centralized Configuration

All test settings are managed in `src/config/test.config.ts`:

```typescript
export const config: TestConfig = {
  baseUrl: process.env.BASE_URL || 'http://localhost',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost/api',
  actionTimeout: parseInt(process.env.ACTION_TIMEOUT || '10000'),
  // ... other settings
};
```

## 🏃 Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Debug tests
npm run test:debug
```

### Specific Test Execution

```bash
# Run specific test file
npx playwright test tests/booking.spec.ts

# Run specific test by name
npx playwright test --grep "Create booking"

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests with specific tag
npx playwright test --grep "@smoke"
```

### Parallel Execution

```bash
# Run tests in parallel (default)
npx playwright test

# Control parallel execution
npx playwright test --workers=2

# Run tests serially
npx playwright test --workers=1
```

## 📊 Reporting

### HTML Reports

```bash
# Generate and view HTML report
npm run report
```

The HTML report includes:
- Test execution timeline
- Screenshots and videos of failures
- Full trace viewer
- Test step breakdown

### Allure Reports

```bash
# Run tests and generate Allure report
npm run test:allure

# Generate Allure report from existing results
npm run allure:generate

# Serve Allure report
npm run allure:serve

# Open static Allure report
npm run allure:open
```

Allure reports provide:
- Trend analysis across test runs
- Detailed test execution history
- Categories and severity levels
- Rich test step documentation
- Screenshots and attachments

## 🧪 Writing Tests

### Test Structure

```typescript
import { test, expect } from '../src/fixtures/test.fixtures';

test.describe('Feature Tests', () => {
  test('Test scenario with API preconditions and UI execution', async ({ 
    api, 
    ui, 
    page, 
    performStep 
  }) => {
    // API Precondition
    await performStep('Setup test data via API', async () => {
      const response = await api.createBooking(testData);
      expect(response.success).toBe(true);
    });

    // UI Execution
    await performStep('Perform user actions in UI', async () => {
      await ui.navigateTo('/booking');
      await ui.clickElement('#create-booking');
    });

    // Mixed Assertions
    await performStep('Verify results via API and UI', async () => {
      // API assertion
      const apiResult = await api.getBooking(bookingId);
      expect(apiResult.data?.status).toBe('active');
      
      // UI assertion
      await ui.assertElementTextContains('.status', 'Active');
    });
  });
});
```

### Available Fixtures

- **`api`**: API utilities for HTTP requests
- **`ui`**: UI utilities for page interactions
- **`authenticatedApi`**: Pre-authenticated API client
- **`testUser`**: Default test user configuration
- **`performStep`**: Wrapper for `test.step()` functionality

### Page Objects

```typescript
import { BookingPage } from '../src/pages/booking.page';

test('Using page objects', async ({ page }) => {
  const bookingPage = new BookingPage(page);
  
  await test.step('Navigate and create booking', async () => {
    await bookingPage.goto();
    await bookingPage.createBooking(bookingData);
  });
});
```

## 🔧 API Testing

### Basic API Operations

```typescript
test('API CRUD operations', async ({ api, performStep }) => {
  let bookingId: number;

  await performStep('Create booking', async () => {
    const response = await api.createBooking(bookingData);
    expect(response.success).toBe(true);
    bookingId = response.data?.id!;
  });

  await performStep('Read booking', async () => {
    const response = await api.getBooking(bookingId);
    expect(response.data?.firstname).toBe(bookingData.firstname);
  });

  await performStep('Update booking', async () => {
    const response = await api.updateBooking(bookingId, updateData);
    expect(response.success).toBe(true);
  });

  await performStep('Delete booking', async () => {
    const response = await api.deleteBooking(bookingId);
    expect(response.success).toBe(true);
  });
});
```

### Authentication

```typescript
test('Authenticated requests', async ({ authenticatedApi }) => {
  // authenticatedApi fixture is pre-authenticated
  const response = await authenticatedApi.getAllBookings();
  expect(response.success).toBe(true);
});
```

## 🎨 UI Testing

### Basic UI Interactions

```typescript
test('UI interactions', async ({ ui, performStep }) => {
  await performStep('Fill and submit form', async () => {
    await ui.navigateTo('/booking');
    await ui.fillInput('#firstname', 'John');
    await ui.fillInput('#lastname', 'Doe');
    await ui.clickElement('#submit');
  });

  await performStep('Verify results', async () => {
    await ui.assertElementTextContains('.success', 'Booking created');
  });
});
```

### Advanced UI Testing

```typescript
test('Advanced UI features', async ({ ui, page }) => {
  // File upload
  await ui.uploadFile('#file-input', './test-data/document.pdf');
  
  // Drag and drop
  await page.dragAndDrop('#source', '#target');
  
  // Multiple tabs
  const newPage = await page.context().newPage();
  
  // Screenshots
  await ui.takePageScreenshot('test-state.png');
});
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright
      run: npx playwright install --with-deps
    - name: Run tests
      run: npm test
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: |
          playwright-report/
          allure-results/
```

## 🚨 Troubleshooting

### Common Issues

1. **Browser Installation**:
   ```bash
   npx playwright install chromium firefox webkit
   ```

2. **Permission Issues**:
   ```bash
   sudo npx playwright install-deps
   ```

3. **Port Conflicts**:
   - Update `BASE_URL` in `.env` file
   - Ensure demo app is running on correct port

4. **Timeout Issues**:
   - Increase timeouts in `test.config.ts`
   - Check network connectivity
   - Verify application performance

### Debug Mode

```bash
# Run with debug mode
PWDEBUG=1 npx playwright test

# Run with headed browser
npx playwright test --headed --slowMo=1000

# Generate trace
npx playwright test --trace=on
```

## 📈 Best Practices

1. **Test Organization**:
   - Group related tests in describe blocks
   - Use descriptive test names
   - Implement proper setup and teardown

2. **Page Objects**:
   - Keep page objects focused and cohesive
   - Use meaningful selector strategies
   - Implement waiting strategies

3. **API Testing**:
   - Use API for test data setup
   - Verify backend state when needed
   - Handle authentication properly

4. **Reporting**:
   - Use test.step() for granular reporting
   - Add meaningful assertions
   - Include screenshots for complex scenarios

5. **Configuration**:
   - Use environment variables for settings
   - Keep sensitive data in .env files
   - Document configuration options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the [troubleshooting section](#-troubleshooting)
- Review [Playwright documentation](https://playwright.dev)
- Create an issue in the project repository
