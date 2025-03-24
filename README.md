# Banking API

A comprehensive REST API for a modern banking application with support for multiple payment methods, checkout sessions, transaction receipts, notifications, and merchant reviews.

## Overview

This Banking API provides a complete backend solution for handling banking operations, including:

- User account management with multi-wallet support (GBP, crypto, tokens)
- Payment card management
- Checkout process
- Payment processing
- Transaction receipts
- Notification system
- Merchant review system

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Project Structure

```
banking-api/
├── src/                      # Source code
│   ├── auth/                 # Authentication functionality
│   ├── card/                 # Payment card management
│   ├── checkout/             # Checkout process
│   ├── common/               # Shared utilities and base classes
│   ├── database/             # Database configuration and migrations
│   │   └── seeds/           # Database seed scripts
│   ├── migrations/           # Database migrations
│   ├── notifications/        # Notification system
│   ├── payment/              # Payment processing
│   ├── receipt/              # Transaction receipts
│   ├── review/               # Merchant reviews
│   ├── user/                 # User management
│   ├── app.module.ts         # Main application module
│   └── main.ts               # Application entry point
├── test/                     # Test cases
├── assets/                   # Documentation and resources
│   ├── banking-api-schema.drawio  # Database schema diagram (editable)
│   ├── banking-api-schema.png     # Database schema diagram (image)
│   ├── banking-api-postman-collection.json    # Postman collection
│   ├── banking-api-postman-environment.json   # Postman environment
│   ├── API_DOCUMENTATION.md       # API documentation
│   ├── POSTMAN_GUIDE.md           # Guide for using Postman collection
│   └── README.md                  # Assets directory documentation
├── dist/                     # Compiled output
├── node_modules/             # Dependencies
├── .env                      # Environment variables
├── .eslintrc.js              # ESLint configuration
├── .gitignore                # Git ignore rules
├── nest-cli.json             # NestJS CLI configuration
├── ormconfig.js              # TypeORM configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tsconfig.build.json       # TypeScript build configuration
└── README.md                 # Project documentation (this file)
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/banking-api.git
   cd banking-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

5. (Optional) Seed the database with test data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run start:dev
   ```

The API will be available at http://localhost:3000/api

### Database Seeding

You can populate the database with test data using the seeding script:

```bash
npm run seed
```

This will create:
- A test user with different wallet balances
- Sample cards linked to the user
- Example checkout sessions
- Test payments
- Sample receipts
- Demo notifications
- Example reviews

You can verify the seed data was created properly with:

```bash
npm run verify-seed
```

### API Documentation

The API is thoroughly documented with Swagger. Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api/docs
```

For a more detailed documentation, please check the `assets/API_DOCUMENTATION.md` file.

## Testing the API with Postman

We provide a comprehensive Postman collection to help you test and explore the API:

1. Import the Postman collection from `assets/banking-api-postman-collection.json`
2. Import the environment from `assets/banking-api-postman-environment.json`
3. Follow the instructions in `assets/POSTMAN_GUIDE.md`

## Database Schema

The database schema is available as both an editable Draw.io file and a static image:

- `assets/banking-api-schema.drawio` - Editable version (Open at [draw.io](https://app.diagrams.net/))
- `assets/banking-api-schema.png` - Static image

## Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start the application in development mode with hot-reload
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:no-setup` - Run end-to-end tests without setting up the test environment
- `npm run test:setup` - Set up the test environment without running tests
- `npm run lint` - Lint the code
- `npm run migration:create` - Create a new migration
- `npm run migration:run` - Run migrations
- `npm run migration:revert` - Revert the last migration
- `npm run seed` - Seed the database with test data
- `npm run verify-seed` - Verify the seed data was created successfully
- `npm run test:db` - Test the database connection

## Testing

The Banking API includes a robust test suite to ensure reliability and stability. Our testing infrastructure is designed to be flexible and resilient to different database configurations.

### End-to-End Testing

The end-to-end tests verify the entire application flow, from user requests to database operations.

#### Prerequisites for Testing

Before running tests, ensure you have the following dependencies installed:

```bash
npm install uuid dotenv bcrypt pg cross-env
```

#### Setting Up the Test Environment

To set up the test environment:

```bash
npm run test:setup
```

This script:
1. Creates a `.env.test` file if it doesn't exist
2. Verifies the database connection
3. Runs database migrations in the test environment
4. Seeds the test database with required data
5. Creates a test user and additional test data necessary for running tests

The setup process includes smart detection of:
- Table naming conventions (singular vs. plural)
- Column naming conventions (camelCase vs. snake_case)
- Primary key constraints
- Available columns in each table

#### Running the Tests

Run the end-to-end tests with:

```bash
npm run test:e2e
```

This command will run both the setup and the actual tests. If you've already set up the test environment and want to run only the tests:

```bash
npm run test:e2e:no-setup
```

### Test Structure

The tests are organized in the `test/` directory:
- `test/auth.e2e-spec.ts` - Tests for authentication endpoints
- `test/user.e2e-spec.ts` - Tests for user management endpoints
- `test/card.e2e-spec.ts` - Tests for payment card operations
- `test/checkout.e2e-spec.ts` - Tests for the checkout process
- `test/payment.e2e-spec.ts` - Tests for payment processing
- `test/receipt.e2e-spec.ts` - Tests for transaction receipts
- `test/notifications.e2e-spec.ts` - Tests for notification system
- `test/review.e2e-spec.ts` - Tests for merchant reviews
- `test/test-utils.ts` - Utility functions for testing
- `test/seed-test-user.js` - Script for creating a test user
- `test/create-test-data.js` - Script for creating additional test data
- `test-setup.js` - Main script for setting up the test environment
- `test/jest-e2e.json` - Jest configuration for E2E tests

### Troubleshooting Tests

If tests fail due to database issues:

1. **Schema mismatch**: The test setup automatically detects your database schema and adapts to it. If you see errors related to missing tables or columns, check your database structure.

2. **Database connection**: Ensure your database is running and accessible with the credentials in your `.env.test` file.

3. **Test data**: If specific tests fail because they can't find test data, run `npm run test:setup` again to recreate test data.

4. **Logs**: Check the console output for detailed error logs. The test setup provides verbose logging to help diagnose issues.

### Customizing the Test Environment

You can customize the test environment by editing the `.env.test` file that is automatically created. This file contains all the necessary configuration for the test database:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=banking_api
JWT_SECRET=test-secret-key
```

## Environment Variables

The application uses the following environment variables:

- `PORT` - The port the API will run on
- `DATABASE_HOST` - PostgreSQL host
- `DATABASE_PORT` - PostgreSQL port
- `DATABASE_USERNAME` - PostgreSQL username
- `DATABASE_PASSWORD` - PostgreSQL password
- `DATABASE_NAME` - PostgreSQL database name
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time
- `REFRESH_TOKEN_SECRET` - Secret for refresh tokens
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiration time

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact the project maintainer.
