#!/usr/bin/env node

/**
 * Setup script for Playwright Booker project
 * This script helps set up the project environment and dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function executeCommand(command, description) {
  try {
    log(`\n📋 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed successfully`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return false;
  }
}

function createDirectoryStructure() {
  const directories = [
    'test-results',
    'test-results/screenshots',
    'test-results/videos',
    'test-results/traces',
    'allure-results',
    'allure-report'
  ];

  log('\n📁 Creating directory structure...', 'blue');
  
  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log(`Created directory: ${dir}`, 'cyan');
    } else {
      log(`Directory already exists: ${dir}`, 'yellow');
    }
  });
  
  // Create .gitkeep files
  directories.forEach(dir => {
    const gitkeepPath = path.join(process.cwd(), dir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
    }
  });
  
  log('✅ Directory structure created successfully', 'green');
}

function createEnvironmentFile() {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), 'env.config.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      log('\n📄 Creating .env file from template...', 'blue');
      fs.copyFileSync(envExamplePath, envPath);
      log('✅ .env file created successfully', 'green');
      log('⚠️  Please review and update .env file with your specific settings', 'yellow');
    } else {
      log('⚠️  env.config.example not found, skipping .env creation', 'yellow');
    }
  } else {
    log('⚠️  .env file already exists, skipping creation', 'yellow');
  }
}

function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].slice(1));
  
  log(`\n🔍 Checking Node.js version: ${nodeVersion}`, 'blue');
  
  if (majorVersion >= 16) {
    log('✅ Node.js version is compatible', 'green');
    return true;
  } else {
    log('❌ Node.js version 16 or higher is required', 'red');
    return false;
  }
}

function installDependencies() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json not found', 'red');
    return false;
  }
  
  return executeCommand('npm install', 'Installing dependencies');
}

function installPlaywrightBrowsers() {
  return executeCommand('npx playwright install', 'Installing Playwright browsers');
}

function installAllure() {
  try {
    execSync('allure --version', { stdio: 'ignore' });
    log('✅ Allure is already installed globally', 'green');
    return true;
  } catch (error) {
    log('\n🔍 Allure not found globally, installing...', 'yellow');
    return executeCommand('npm install -g allure-commandline', 'Installing Allure globally');
  }
}

function verifySetup() {
  log('\n🧪 Verifying setup...', 'blue');
  
  const checks = [
    {
      name: 'TypeScript compilation',
      command: 'npx tsc --noEmit',
      required: true
    },
    {
      name: 'Playwright configuration',
      command: 'npx playwright test --list',
      required: true
    },
    {
      name: 'Allure availability',
      command: 'allure --version',
      required: false
    }
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    try {
      execSync(check.command, { stdio: 'ignore' });
      log(`✅ ${check.name}: OK`, 'green');
    } catch (error) {
      if (check.required) {
        log(`❌ ${check.name}: FAILED`, 'red');
        allPassed = false;
      } else {
        log(`⚠️  ${check.name}: NOT AVAILABLE (optional)`, 'yellow');
      }
    }
  });
  
  return allPassed;
}

function showUsageInstructions() {
  log('\n🎉 Setup completed!', 'green');
  log('\n📖 Quick Start:', 'cyan');
  log('1. Review and update .env file with your settings');
  log('2. Start your demo application on http://localhost');
  log('3. Run tests: npm test');
  log('4. View HTML report: npm run report');
  log('5. Generate Allure report: npm run test:allure');
  log('\n📚 Available commands:', 'cyan');
  log('  npm test                - Run all tests');
  log('  npm run test:headed     - Run tests in headed mode');
  log('  npm run test:debug      - Run tests in debug mode');
  log('  npm run test:ui         - Run tests with UI mode');
  log('  npm run report          - Open HTML report');
  log('  npm run allure:serve    - Serve Allure report');
  log('\n🔗 Documentation: See README.md for detailed instructions');
}

async function main() {
  log('🚀 Playwright Booker Project Setup', 'cyan');
  log('=====================================', 'cyan');
  
  if (!checkNodeVersion()) {
    process.exit(1);
  }
  
  createDirectoryStructure();
  createEnvironmentFile();
  
  if (!installDependencies()) {
    log('❌ Failed to install dependencies', 'red');
    process.exit(1);
  }
  
  if (!installPlaywrightBrowsers()) {
    log('❌ Failed to install Playwright browsers', 'red');
    process.exit(1);
  }
  
  installAllure(); // Optional, don't exit on failure
  
  if (!verifySetup()) {
    log('⚠️  Setup completed with warnings. Please check the issues above.', 'yellow');
  }
  
  showUsageInstructions();
}

if (require.main === module) {
  main().catch(error => {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = {
  executeCommand,
  createDirectoryStructure,
  createEnvironmentFile,
  checkNodeVersion,
  installDependencies,
  installPlaywrightBrowsers,
  installAllure,
  verifySetup
};
