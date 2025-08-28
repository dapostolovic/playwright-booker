# Playwright Test Project for Shady Meadows B&B

A comprehensive Playwright TypeScript project to test the Shady Meadows B&B application with advanced configuration management and data-driven testing approaches.

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

### Environment-Specific Testing

The project supports multiple environments through environment variables:

```bash
# Local (default)
npx playwright test

# Staging
STAGING=1 npx playwright test

# Development
DEVELOPMENT=1 npx playwright test

# Production
PRODUCTION=1 npx playwright test

# Custom URL
BASE_URL=http://my-custom-url.com npx playwright test

# Custom staging URL
STAGING=1 STAGING_URL=http://my-staging-url.com npx playwright test
```

## Project Structure

```
test01/
├── config/
│   ├── app.config.ts              # Centralized application configuration with environment support
│   └── routes.config.ts           # Centralized route definitions and URL validation helpers
├── pages/
│   ├── MainPage.ts                # Page object for main page elements (refactored with constructor-based locators)
│   ├── AdminLogin.ts              # Page object for admin login functionality
│   └── AdminRooms.ts              # Page object for admin room management (refactored with constructor-based locators)
├── src/
│   └── data/
│       └── test-data.ts           # Test data for all scenarios (updated with data-driven structures)
├── tests/
│   ├── main.page.spec.ts          # Main page tests
│   ├── contact.spec.ts            # Contact form tests (refactored with data-driven negative testing)
│   ├── admin.login.spec.ts        # Admin authentication tests
│   ├── admin.rooms.spec.ts        # Admin room management tests (refactored with data-driven negative testing)
│   ├── api.auth.spec.ts           # API authentication tests (currently skipped)
│   └── config.spec.ts             # Configuration validation tests
├── playwright.config.ts           # Playwright configuration with environment support
├── package.json                   # Project dependencies and scripts
└── README.md                      # This file
```

This updated README reflects all the current improvements including:
- Environment-based configuration
- Data-driven testing approaches
- Centralized route management
- Constructor-based page objects
- API testing capabilities
- Configuration validation tests
- Enhanced project structure

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
- **Room Deletion**: Tests room deletion functionality
- **Complete Room Workflow**: Tests end-to-end room creation and deletion workflow

### API Authentication Tests (`tests/api.auth.spec.ts`)
- **Login API Endpoint**: Tests POST request to `/api/auth/login` (currently skipped due to endpoint availability)
- **Token Validation**: Verifies successful login returns valid token structure

### Configuration Tests (`tests/config.spec.ts`)
- **Environment Configuration**: Validates correct base URL usage based on environment settings

## Configuration

### Application Configuration (`config/app.config.ts`)
- **Environment-Based Base URL**: Dynamic URL configuration for different environments
- **Centralized Routes**: Single source of truth for all application routes
- **Timeout Settings**: Global timeout configuration
- **Environment Detection**: Automatic environment detection and validation

### Routes Configuration (`config/routes.config.ts`)
- **Centralized Route Definitions**: All application routes defined in one place
- **URL Validation Helpers**: Helper methods for route validation
- **Type Safety**: Full TypeScript support with IntelliSense

## Key Features

### Advanced Configuration Management
- **Environment-Specific Testing**: Support for local, staging, development, and production environments
- **Centralized Route Management**: Single source of truth for all application URLs
- **Dynamic Configuration**: Environment variables override default settings
- **Configuration Validation**: Built-in tests to verify configuration correctness

### Data-Driven Testing
- **Negative Test Optimization**: Reduced code duplication through data-driven approaches
- **Comprehensive Test Coverage**: Multiple invalid scenarios tested with shared assertions
- **Maintainable Test Data**: Centralized test data with descriptive naming
- **Conditional Test Skipping**: Ability to skip specific test scenarios when needed

### Page Object Model Enhancements
- **Constructor-Based Locators**: Improved performance and maintainability
- **Dynamic Locator Methods**: Support for parameterized selectors
- **Consistent Patterns**: Standardized approach across all page objects
- **Type Safety**: Full TypeScript support with proper Locator types

### Code Quality
- **Clean Architecture**: Separation of concerns with dedicated modules
- **Maintainable Structure**: Easy to extend and modify
- **Best Practices**: Follows Playwright and TypeScript best practices
- **Comprehensive Coverage**: Tests for UI, API, and configuration validation

## Adding New Tests

1. **Add locators** to the appropriate page object in the `pages/` directory
2. **Add test data** to `src/data/test-data.ts` if needed (use data-driven structures for multiple scenarios)
3. **Create new test files** in the `tests/` directory following the naming convention: `feature.spec.ts`
4. **Follow the existing pattern** for test structure and assertions
5. **Use data-driven approaches** for multiple similar test scenarios

## Environment Configuration

The project supports flexible environment configuration:

- **Default**: Uses `http://localhost`
- **Staging**: Uses `STAGING_URL` or defaults to `http://my-staging-url.com`
- **Development**: Uses `DEV_URL` or defaults to `http://my-dev-url.com`
- **Production**: Uses `PROD_URL` or defaults to `http://my-prod-url.com`

Environment variables can be set via command line or environment files for CI/CD integration.
