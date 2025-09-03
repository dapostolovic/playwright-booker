# Playwright Test Project for Shady Meadows B&B

A comprehensive Playwright TypeScript project to test the Shady Meadows B&B application with advanced configuration management, data-driven testing approaches, and optimized Page Object Model implementation.

## Prerequisites

- Node.js (version 16 or higher)
- Your application running on `http://localhost`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npm run install-browsers
```

## Running Tests

### Run all tests (headless):
```bash
npm test
```

### Run tests with browser visible:
```bash
npm run test:headed
```

### Run tests with Playwright UI:
```bash
npm run test:ui
```

### Run tests with debugging:
```bash
npm run test:debug
```

### Run specific test suites:
```bash
# Contact form tests
npm run test:contact

# Admin tests (login + room management)
npm run test:admin

# API authentication tests
npm run test:api
```

### Environment-Specific Testing

The project supports multiple environments through environment variables. **Use PowerShell for Windows:**

```powershell
# Local (default)
npx playwright test

# Development
$env:DEVELOPMENT="1"; npx playwright test

# Staging
$env:STAGING="1"; npx playwright test

# Production
$env:PRODUCTION="1"; npx playwright test

# Custom URL
$env:BASE_URL="http://my-custom-url.com"; npx playwright test

# Custom staging URL
$env:STAGING="1"; $env:STAGING_URL="http://my-staging-url.com"; npx playwright test

# Reset environment variable to default
Remove-Item Env:DEVELOPMENT -ErrorAction SilentlyContinue; npx playwright test
```

**For Command Prompt (Windows):**
```cmd
set DEVELOPMENT=1 & npx playwright test
```

## Project Structure

```
playwright-booker-demo/
├── pages/
│   ├── BasePage.ts                # Base page object with common functionality
│   ├── MainPage.ts                # Page object for main page elements
│   ├── AdminLogin.ts              # Page object for admin login functionality
│   └── AdminRooms.ts              # Page object for admin room management
├── src/
│   └── data/
│       └── test-data.ts           # Test data for all scenarios
├── tests/
│   ├── main.page.spec.ts          # Main page tests
│   ├── contact.spec.ts            # Contact form tests with data-driven negative testing
│   ├── admin.login.spec.ts        # Admin authentication tests
│   ├── admin.rooms.spec.ts        # Admin room management tests
│   ├── api.auth.spec.ts           # API authentication tests
│   └── config.spec.ts             # Configuration validation tests
├── playwright.config.js           # Main Playwright configuration with environment support
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## Current Tests

### Main Page Tests (`tests/main.page.spec.ts`)
- **Welcome Title Visibility**: Verifies that the welcome title is visible on the main page
- **Welcome Title Content**: Verifies that the welcome title contains "Welcome to Shady Meadows B&B"
- **Single Room Booking**: Tests booking initiation for Single room type
- **All Room Types**: Verifies that all room types (Single, Double, Suite) can be selected for booking

### Contact Form Tests (`tests/contact.spec.ts`)
- **Valid Contact Form**: Tests successful contact form submission
- **Data-Driven Negative Tests**: Comprehensive validation testing for:
  - Empty name field
  - Invalid email format
  - Short subject (less than 5 characters)
  - Short message (less than 20 characters)
  - Empty email field
  - Empty phone field
- **Maximum Length Validation**: Tests form validation for maximum field lengths

### Admin Authentication Tests (`tests/admin.login.spec.ts`)
- **Valid Login**: Tests successful admin login with valid credentials
- **Invalid Login**: Tests login failure with various invalid credentials
- **Logout Functionality**: Tests admin logout process
- **Room Management Access**: Verifies admin access to room management features

### Admin Room Management Tests (`tests/admin.rooms.spec.ts`)
- **Valid Room Creation**: Tests successful room creation with valid data
- **Data-Driven Negative Tests**: Comprehensive validation testing for:
  - Empty room name
  - Price is zero
  - Negative price values
  - Price less than 1
- **Room Deletion**: Tests room deletion functionality with optimized locators
- **Complete Room Workflow**: Tests end-to-end room creation and deletion workflow

### API Authentication Tests (`tests/api.auth.spec.ts`)
- **Complete API Testing Suite**: Comprehensive API testing for authentication and room management
- **Authentication Flow**: Tests POST request to `/api/auth/login` with token extraction and validation
- **Room Management API**: Full CRUD operations via API:
  - **Create Room**: POST to `/api/room` with authentication and unique room names
  - **Retrieve Room ID**: GET from `/api/room` to extract room ID for created rooms
  - **Delete Room**: DELETE to `/api/room/{id}` to clean up test data
- **Unique Room Names**: Automatic generation of unique room names to prevent conflicts
- **Authentication Headers**: Proper Bearer token and cookie authentication
- **Environment-Aware URLs**: Uses Playwright configuration for environment-specific API endpoints

### Configuration Tests (`tests/config.spec.ts`)
- **Environment Configuration**: Validates correct base URL usage based on environment settings

## Configuration

### Playwright Configuration (`playwright.config.js`)
- **Environment-Based Base URL**: Dynamic URL configuration for different environments
- **API URL Configuration**: Automatic API endpoint configuration based on environment
- **Centralized Configuration**: Single source of truth for all Playwright settings
- **Environment Detection**: Automatic environment detection and validation
- **Default Environment**: Uses `http://localhost` when no environment is specified
- **API Endpoint Management**: Automatically derives API URLs from base URLs (e.g., `http://localhost/api/`)

### Environment Variables
- **DEVELOPMENT=1**: Uses development environment URL
- **STAGING=1**: Uses staging environment URL
- **PRODUCTION=1**: Uses production environment URL
- **BASE_URL**: Custom base URL override
- **STAGING_URL**: Custom staging URL override
- **DEV_URL**: Custom development URL override
- **PROD_URL**: Custom production URL override

## Key Features

### Advanced Configuration Management
- **Environment-Specific Testing**: Support for local, staging, development, and production environments
- **API URL Configuration**: Automatic API endpoint configuration that adapts to environment changes
- **Centralized Configuration**: Single source of truth for all settings in `playwright.config.js`
- **Dynamic Configuration**: Environment variables override default settings
- **Cross-Platform Support**: Works on Windows (PowerShell/Command Prompt) and Unix systems

### Data-Driven Testing
- **Negative Test Optimization**: Reduced code duplication through data-driven approaches
- **Comprehensive Test Coverage**: Multiple invalid scenarios tested with shared assertions
- **Maintainable Test Data**: Centralized test data with descriptive naming
- **Conditional Test Skipping**: Ability to skip specific test scenarios when needed

### Page Object Model Enhancements
- **Base Page Class**: Common functionality shared across all page objects
- **Constructor-Based Locators**: Improved performance and maintainability
- **Dynamic Locator Methods**: Support for parameterized selectors
- **Consistent Patterns**: Standardized approach across all page objects
- **Type Safety**: Full TypeScript support with proper Locator types
- **Optimized Locators**: Improved room deletion using `:has()` selector for better reliability

### Code Quality
- **Clean Architecture**: Separation of concerns with dedicated modules
- **Maintainable Structure**: Easy to extend and modify
- **Best Practices**: Follows Playwright and TypeScript best practices
- **Comprehensive Coverage**: Tests for UI, API, and configuration validation
- **API Testing Best Practices**: Proper authentication, unique data generation, and environment-aware configuration

## Recent Improvements

### AdminRooms Page Object (`pages/AdminRooms.ts`)
- **Optimized Room Deletion**: Improved `deleteRoom()` method using `:has()` selector for better reliability
- **Enhanced Locator Strategy**: Uses `[data-testid="roomlisting"]:has(#roomName${roomName})` for more robust room identification
- **Better Error Handling**: Added explicit waits with shorter timeouts for faster debugging
- **Cleaner Code Structure**: Removed complex XPath navigation in favor of Playwright-native selectors

### Configuration Consolidation
- **Single Configuration File**: All Playwright settings consolidated in `playwright.config.js`
- **Environment Flexibility**: Easy switching between environments via command-line variables
- **API URL Management**: Automatic API endpoint configuration based on environment

### API Testing Enhancements
- **Complete CRUD Operations**: Full room management via API (Create, Read, Delete)
- **Unique Data Generation**: Automatic generation of unique room names to prevent test conflicts
- **Environment-Aware URLs**: API endpoints automatically adapt to different environments
- **Proper Authentication**: Bearer token and cookie-based authentication for secure API access
- **Test Data Cleanup**: Automatic cleanup of test data to maintain test isolation
- **Comprehensive Logging**: Detailed logging for debugging API interactions

## Adding New Tests

### UI Tests
1. **Add locators** to the appropriate page object in the `pages/` directory
2. **Add test data** to `src/data/test-data.ts` if needed (use data-driven structures for multiple scenarios)
3. **Create new test files** in the `tests/` directory following the naming convention: `feature.spec.ts`
4. **Follow the existing pattern** for test structure and assertions
5. **Use data-driven approaches** for multiple similar test scenarios

### API Tests
1. **Use environment-aware URLs**: Access API endpoints via `process.env.API_BASE_URL`
2. **Follow authentication patterns**: Use Bearer token and cookie authentication as needed
3. **Generate unique test data**: Use helper functions like `generateUniqueRoomName()` to prevent conflicts
4. **Implement proper cleanup**: Always clean up test data (e.g., delete created resources)
5. **Use test.step()**: Break down complex API workflows into logical steps

## Environment Configuration

The project supports flexible environment configuration through `playwright.config.js`:

- **Default**: Uses `http://localhost`
- **Development**: Uses `DEV_URL` or defaults to `http://dev.example.test/`
- **Staging**: Uses `STAGING_URL` or defaults to `http://staging.example.test/`
- **Production**: Uses `PROD_URL` or defaults to `http://prod.example.test/`

### API Endpoint Configuration
- **Automatic API URLs**: API endpoints automatically adapt to environment changes
- **Example**: 
  - Local: `http://localhost/api/`
  - Development: `http://dev.example.test/api/`
  - Staging: `http://staging.example.test/api/`
  - Production: `http://prod.example.test/api/`

Environment variables can be set via command line or environment files for CI/CD integration.

## Available Scripts

- `npm test` - Run all tests in headless mode
- `npm run test:headed` - Run tests with browser visible
- `npm run test:ui` - Run tests with Playwright UI mode
- `npm run test:debug` - Run tests in debug mode
- `npm run test:contact` - Run only contact form tests
- `npm run test:admin` - Run admin login and room management tests
- `npm run test:api` - Run API authentication tests
- `npm run install-browsers` - Install Playwright browsers
- `npm run report` - Show Playwright HTML report
- `npm run clean` - Clean test results and reports

## Troubleshooting

### Environment Variables Not Working
- **Windows**: Use PowerShell instead of Command Prompt
- **PowerShell**: Use `$env:VARIABLE="value"` syntax
- **Command Prompt**: Use `set VARIABLE=value &` syntax
- **Unix/Linux**: Use `VARIABLE=value` syntax

### Reset Environment Variables
```powershell
# Remove specific variable
Remove-Item Env:DEVELOPMENT -ErrorAction SilentlyContinue

# Start new PowerShell session for complete reset
```

### Verify Configuration
The `playwright.config.js` includes debug logging to show which environment is being used and the final base URL.

### API Testing Issues
- **Authentication Errors**: Ensure both Bearer token and cookie authentication are included
- **URL Configuration**: Verify `API_BASE_URL` is correctly set in Playwright configuration
- **Unique Data Conflicts**: Check that test data generation creates unique identifiers
- **Environment Mismatch**: Ensure API endpoints match the environment being tested