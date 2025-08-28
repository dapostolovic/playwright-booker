import { Routes } from './routes.config';

// Centralized environment-based configuration
export const getBaseUrl = (): string => {
  // Check for environment-specific URLs
  if (process.env.STAGING === '1') {
    return process.env.STAGING_URL || 'http://my-staging-url.com';
  }
  
  if (process.env.DEVELOPMENT === '1') {
    return process.env.DEV_URL || 'http://my-dev-url.com';
  }
  
  if (process.env.PRODUCTION === '1') {
    return process.env.PROD_URL || 'http://my-prod-url.com';
  }
  
  // Default to localhost if no environment is specified
  return process.env.BASE_URL || 'http://localhost';
};

export const AppConfig = {
  baseUrl: getBaseUrl(),
  timeout: parseInt(process.env.TIMEOUT || '30000'),
  routes: Routes,
} as const;

// Export environment helper for debugging
export const Environment = {
  current: process.env.STAGING === '1' ? 'staging' : 
           process.env.DEVELOPMENT === '1' ? 'development' : 
           process.env.PRODUCTION === '1' ? 'production' : 'local',
  baseUrl: getBaseUrl(),
} as const;
