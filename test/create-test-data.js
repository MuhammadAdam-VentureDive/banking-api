/**
 * This script creates test data needed for the integration tests
 */

const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Creates essential test data for running the integration tests
 */
async function createTestData() {
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

    // First, check which tables exist by querying the database
    console.log('Checking database schema...');
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tableNames = tables.rows.map(row => row.table_name);
    console.log('Available tables:', tableNames);
    
    // Check for user table (singular or plural)
    let userId = null;
    let userTableName = null;
    
    if (tableNames.includes('users')) {
      userTableName = 'users';
    } else if (tableNames.includes('user')) {
      userTableName = 'user';
    } else {
      console.error('Could not find user table (neither "user" nor "users" exist)');
      return;
    }
    
    console.log(`Using user table: "${userTableName}"`);
    
    // Get the user ID
    const userResult = await client.query(
      `SELECT id FROM "${userTableName}" WHERE email = $1`,
      ['john@example.com']
    );

    if (userResult.rows.length === 0) {
      console.error('Test user not found. Please run seed-test-user.js first.');
      return;
    }

    userId = userResult.rows[0].id;
    console.log('Found test user with ID:', userId);

    // Check for checkout table (singular or plural)
    let checkoutTableName = null;
    
    if (tableNames.includes('checkout')) {
      checkoutTableName = 'checkout';
    } else if (tableNames.includes('checkouts')) {
      checkoutTableName = 'checkouts';
    } else {
      console.log('Could not find checkout table (neither "checkout" nor "checkouts" exist)');
      return;
    }
    
    console.log(`Using checkout table: "${checkoutTableName}"`);
    await createCheckoutData(client, checkoutTableName, userId);

    console.log('Test data setup complete');
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await client.end();
  }
}

/**
 * Creates checkout test data for a given user
 */
async function createCheckoutData(client, tableName, userId) {
  try {
    // Create a test checkout
    const checkoutId = uuidv4();
    console.log(`Creating test ${tableName} with ID:`, checkoutId);
    
    // Verify checkout table structure
    const checkoutTableInfo = await client.query(`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_name = $1
    `, [tableName]);
    
    if (checkoutTableInfo.rows.length > 0) {
      const checkoutColumns = checkoutTableInfo.rows.map(row => row.column_name);
      console.log(`${tableName} table columns:`, checkoutColumns);
      
      // Check if user_id or userId is used in the table
      const userIdColumn = checkoutColumns.includes('user_id') ? 'user_id' : 
                           checkoutColumns.includes('userId') ? 'userId' : null;
                           
      if (!userIdColumn) {
        console.error(`Could not find user ID column in ${tableName} table`);
        return;
      }
      
      // Map camelCase fields to snake_case as needed
      const columnMap = {
        id: 'id',
        userId: userIdColumn,
        amount: checkoutColumns.includes('amount') ? 'amount' : null,
        merchantName: checkoutColumns.includes('merchant_name') ? 'merchant_name' : 
                     checkoutColumns.includes('merchantName') ? 'merchantName' : null,
        merchantId: checkoutColumns.includes('merchant_id') ? 'merchant_id' : 
                   checkoutColumns.includes('merchantId') ? 'merchantId' : null,
        status: checkoutColumns.includes('status') ? 'status' : null,
        createdAt: checkoutColumns.includes('created_at') ? 'created_at' : 
                  checkoutColumns.includes('createdAt') ? 'createdAt' : null,
        updatedAt: checkoutColumns.includes('updated_at') ? 'updated_at' : 
                  checkoutColumns.includes('updatedAt') ? 'updatedAt' : null
      };
      
      // Filter out null values
      const filteredColumnMap = Object.fromEntries(
        Object.entries(columnMap).filter(([_, value]) => value !== null)
      );
      
      if (Object.keys(filteredColumnMap).length === 0) {
        console.error(`Not enough column matches found in ${tableName} table`);
        return;
      }
      
      // Prepare data for insertion
      const columns = [];
      const values = [];
      const placeholders = [];
      let paramCounter = 1;
      
      // Set values
      const checkoutData = {
        id: checkoutId,
        userId: userId,
        amount: 99.99,
        merchantName: 'Test Merchant',
        merchantId: 'test-merchant-id',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Build insertion arrays
      Object.entries(filteredColumnMap).forEach(([key, column]) => {
        columns.push(`"${column}"`);
        values.push(checkoutData[key]);
        placeholders.push(`$${paramCounter++}`);
      });
      
      // Create and execute the insert query with conflict handling
      let insertQuery;
      
      // Check if the table has a primary key constraint on id
      const pkCheck = await client.query(`
        SELECT a.attname
        FROM   pg_index i
        JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE  i.indrelid = $1::regclass
        AND    i.indisprimary
      `, [`${tableName}`]);
      
      const primaryKeyColumns = pkCheck.rows.map(row => row.attname);
      console.log(`Primary key columns for ${tableName}:`, primaryKeyColumns);
      
      if (primaryKeyColumns.includes('id')) {
        // If id is a primary key, use ON CONFLICT
        insertQuery = `
          INSERT INTO "${tableName}" (${columns.join(', ')})
          VALUES (${placeholders.join(', ')})
          ON CONFLICT (id) DO NOTHING
        `;
      } else {
        // If no primary key on id, check if the record exists first
        const existsCheck = await client.query(`
          SELECT EXISTS (SELECT 1 FROM "${tableName}" WHERE id = $1)
        `, [checkoutId]);
        
        if (existsCheck.rows[0].exists) {
          console.log(`Record with id ${checkoutId} already exists in ${tableName}`);
          return checkoutId;
        }
        
        // Simple insert without the ON CONFLICT clause
        insertQuery = `
          INSERT INTO "${tableName}" (${columns.join(', ')})
          VALUES (${placeholders.join(', ')})
        `;
      }
      
      console.log('Executing query:', insertQuery);
      console.log('With values:', values);
      
      await client.query(insertQuery, values);
      console.log(`Test ${tableName} created or already exists`);
      
      // Return the checkout ID for use in other test data creation
      return checkoutId;
    }
  } catch (error) {
    console.error(`Error creating test ${tableName}:`, error);
  }
}

// Run the function
createTestData().catch(console.error); 