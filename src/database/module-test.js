console.log('Testing module compatibility...');

try {
  // Try to load TypeORM
  const typeorm = require('typeorm');
  console.log('TypeORM loaded successfully');
  
  // Try to load dotenv
  const dotenv = require('dotenv');
  console.log('dotenv loaded successfully');
  
  // Try to load pg (PostgreSQL driver)
  const pg = require('pg');
  console.log('pg loaded successfully');
  
  console.log('All basic modules loaded successfully!');
  
  // Check if NODE_ENV is production or development
  console.log('Node environment:', process.env.NODE_ENV);
  
  // Print out some debug info
  console.log('Current directory:', __dirname);
  console.log('Module paths:', require.resolve.paths('typeorm'));
} catch (error) {
  console.error('Error loading modules:', error);
} 