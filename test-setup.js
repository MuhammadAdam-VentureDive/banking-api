/**
 * This script ensures the test database is properly seeded with test data
 * Run it before running the e2e tests
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load existing .env file to get current DB config
dotenv.config();

// Set environment to test
process.env.NODE_ENV = 'test';

console.log('Setting up test environment...');

try {
  // Make sure we have a .env.test file
  const envTestPath = path.join(__dirname, '.env.test');
  if (!fs.existsSync(envTestPath)) {
    console.log('Creating .env.test file...');
    const envContents = `
DB_HOST=${process.env.DB_HOST || 'localhost'}
DB_PORT=${process.env.DB_PORT || '5432'}
DB_USERNAME=${process.env.DB_USERNAME || 'root'}
DB_PASSWORD=${process.env.DB_PASSWORD || 'root'}
DB_DATABASE=${process.env.DB_DATABASE || 'banking_api'}
JWT_SECRET=${process.env.JWT_SECRET || 'test-secret-key'}
    `.trim();
    fs.writeFileSync(envTestPath, envContents);
  }

  // Try to connect to the database first to check if it's available
  console.log('Checking database connection...');
  try {
    execSync('npm run test:db', { stdio: 'inherit' });
    console.log('Database connection successful.');
  } catch (dbError) {
    console.error('Database connection failed. Please check your database configuration.');
    console.error(dbError);
    process.exit(1);
  }

  // Run database migrations with the test environment
  console.log('Running database migrations...');
  try {
    execSync('cross-env NODE_ENV=test npm run migration:run', { stdio: 'inherit' });
  } catch (migrationError) {
    console.warn('Warning: Migration failed, but continuing. Error:', migrationError.message);
  }

  // Seed the test database with required test data
  console.log('Seeding test data...');
  try {
    execSync('cross-env NODE_ENV=test npm run seed', { stdio: 'inherit' });
  } catch (seedError) {
    // This might fail if seed data already exists, which is fine
    console.warn('Warning: Seeding database failed, but continuing. The data might already exist.');
    console.warn('Error message:', seedError.message);
  }

  // Make sure we have the test user
  console.log('Creating test user...');
  execSync('node test/seed-test-user.js', { stdio: 'inherit' });

  // Create other test data
  console.log('Creating other test data...');
  execSync('node test/create-test-data.js', { stdio: 'inherit' });

  console.log('Test environment setup complete.');
} catch (error) {
  console.error('Error setting up test environment:', error);
  process.exit(1);
} 