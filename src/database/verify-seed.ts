import dataSource from './data-source';

async function verifySeed() {
  // Initialize the data source
  await dataSource.initialize();
  
  try {
    console.log('Verifying seed data...');

    // Check User
    const users = await dataSource.query('SELECT * FROM users');
    console.log(`Users: ${users.length} record(s) found`);
    console.log('First user:', {
      id: users[0].id,
      email: users[0].email,
      username: users[0].username
    });

    // Check Notifications
    const notifications = await dataSource.query('SELECT * FROM notifications');
    console.log(`Notifications: ${notifications.length} record(s) found`);

    // Check Cards
    const cards = await dataSource.query('SELECT * FROM cards');
    console.log(`Cards: ${cards.length} record(s) found`);

    // Check Checkouts
    const checkouts = await dataSource.query('SELECT * FROM checkouts');
    console.log(`Checkouts: ${checkouts.length} record(s) found`);

    // Check Payments
    const payments = await dataSource.query('SELECT * FROM payments');
    console.log(`Payments: ${payments.length} record(s) found`);

    // Check Receipts
    const receipts = await dataSource.query('SELECT * FROM receipts');
    console.log(`Receipts: ${receipts.length} record(s) found`);

    // Check Reviews
    const reviews = await dataSource.query('SELECT * FROM reviews');
    console.log(`Reviews: ${reviews.length} record(s) found`);

    console.log('Verification completed successfully!');
  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await dataSource.destroy();
  }
}

verifySeed(); 