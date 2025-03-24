import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source';

async function testConnection() {
  console.log('Testing database connection...');
  
  try {
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();
    console.log('✅ Database connection successful!');
    const result = await dataSource.query('SELECT NOW()');
    console.log('Current database time:', result[0].now);
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error details:', error);
  }
}

testConnection(); 