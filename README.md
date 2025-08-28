# Playwright Test Project for Shady Meadows B&B

A comprehensive Playwright TypeScript project to test the Shady Meadows B&B application.

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

## Project Structure

```
test01/
├── config/
│   └── app.config.ts              # Centralized application configuration
├── pages/
│   ├── MainPage.ts                # Page object for main page elements
│   ├── AdminLogin.ts              # Page object for admin login functionality
│   └── AdminRooms.ts              # Page object for admin room management
├── src/
│   └── data/
│       └── test-data.ts           # Test data for all scenarios
├── tests/
│   ├── main.page.spec.ts          # Main page tests
│   ├── contact.spec.ts            # Contact form tests
│   ├── admin.login.spec.ts        # Admin authentication tests
│   └── admin.rooms.spec.ts        # Admin room management tests
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project dependencies and scripts
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
- **Empty Name Validation**: Tests form validation for empty name field
- **Invalid Email Validation**: Tests form validation for invalid email format
- **Short Subject Validation**: Tests form validation for subject field minimum length
- **Short Message Validation**: Tests form validation for message field minimum length
- **Maximum Length Validation**: Tests form validation for maximum field lengths

### Admin Authentication Tests (`tests/admin.login.spec.ts`)
- **Valid Login**: Tests successful admin login with valid credentials
- **Invalid Login**: Tests login failure with various invalid credentials
- **Logout Functionality**: Tests admin logout process
- **Room Management Access**: Verifies admin access to room management features

### Admin Room Management Tests (`tests/admin.rooms.spec.ts`)
- **Valid Room Creation**: Tests successful room creation with valid data
- **Invalid Room Validation**: Tests room creation validation for empty room name
- **Invalid Price Validation**: Tests room creation validation for invalid price
- **Room Deletion**: Tests room deletion functionality
- **Complete Room Workflow**: Tests end-to-end room creation and deletion workflow

## Configuration

### Application Configuration (`config/app.config.ts`)
- **Base URL**: Centralized application URL configuration
- **Timeouts**: Global timeout settings
- **Environment-specific settings**: Easy configuration for different environments

## Adding New Tests

1. **Add locators** to the appropriate page object in the `pages/` directory
2. **Add test data** to `src/data/test-data.ts` if needed
3. **Create new test files** in the `tests/` directory following the naming convention: `feature.spec.ts`
4. **Follow the existing pattern** for test structure and assertions

## Key Features

- **Page Object Model**: Clean separation of locators and test logic with dedicated page objects for each functionality area
- **Centralized Configuration**: Single source of truth for application settings
- **Comprehensive Test Coverage**: Main page, contact form, and admin functionality (login and room management)
- **Clean Code Structure**: Optimized for maintainability and future expansion
- **Separation of Concerns**: Admin functionality split into login and room management for better maintainability
