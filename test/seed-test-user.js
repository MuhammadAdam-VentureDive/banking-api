/**
 * This script adds the test user needed for e2e tests
 */

const { execSync } = require('child_process');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

// Create a test user directly in the database
async function seedTestUser() {
  // Configure client based on environment variables or defaults
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'banking_api',
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    // First, let's check the table structure to determine the correct table name
    console.log('Checking database schema...');
    
    // Check if "user" table exists
    let userTableName = "user";
    try {
      const tableCheckResult = await client.query(
        "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user')"
      );
      if (!tableCheckResult.rows[0].exists) {
        // If "user" doesn't exist, try "users"
        const usersTableCheckResult = await client.query(
          "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users')"
        );
        if (usersTableCheckResult.rows[0].exists) {
          userTableName = "users";
        } else {
          throw new Error('Could not find user table in database');
        }
      }
    } catch (error) {
      console.error('Error checking table existence:', error);
      // Default to "user" if there's an error
      userTableName = "user";
    }
    
    console.log(`Using table name: "${userTableName}"`);

    // Now check the columns in the table to know what fields we need to include
    let tableInfo;
    try {
      tableInfo = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [userTableName]);
      
      console.log('Table columns:');
      tableInfo.rows.forEach(row => {
        console.log(`- ${row.column_name} (${row.data_type})`);
      });
    } catch (error) {
      console.error('Error getting table columns:', error);
    }

    // Check if the user already exists
    const checkResult = await client.query(
      `SELECT * FROM "${userTableName}" WHERE email = $1`,
      ['john@example.com']
    );

    if (checkResult.rows.length > 0) {
      console.log('Test user already exists');
      console.log('User ID:', checkResult.rows[0].id);
      return;
    }

    // Create a new user
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Dynamically build the query based on the available columns
    const columnNames = tableInfo.rows.map(row => row.column_name);
    
    // These are the values we want to insert - we'll only include the ones that exist in the table
    const possibleValues = {
      id: userId,
      email: 'john@example.com',
      username: 'john_doe',
      fullName: 'John Doe',
      password: passwordHash,
      gbpWalletBalance: 1000,
      cryptoBalance: 100,
      snTokenBalance: 50,
      notificationCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Build columns and values arrays based on what's actually in the table
    const columns = [];
    const values = [];
    const placeholders = [];
    let paramCounter = 1;
    
    // Map our values to the table's actual columns
    Object.keys(possibleValues).forEach(key => {
      // Convert camelCase to snake_case for comparison
      const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      if (columnNames.includes(key)) {
        columns.push(`"${key}"`);
        values.push(possibleValues[key]);
        placeholders.push(`$${paramCounter++}`);
      } else if (columnNames.includes(snakeCaseKey)) {
        columns.push(`"${snakeCaseKey}"`);
        values.push(possibleValues[key]);
        placeholders.push(`$${paramCounter++}`);
      }
    });
    
    // Create and execute the insert query
    const insertQuery = `
      INSERT INTO "${userTableName}" (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;
    
    console.log('Executing query:', insertQuery);
    await client.query(insertQuery, values);

    console.log('Test user created successfully');
    console.log('User ID:', userId);
    console.log('Email: john@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await client.end();
  }
}

// Run the function
seedTestUser().catch(console.error); 