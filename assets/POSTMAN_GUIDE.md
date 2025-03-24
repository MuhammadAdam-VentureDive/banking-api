# Postman Guide for Banking API

This guide provides instructions for setting up and using the Postman collection for testing and exploring the Banking API.

## Getting Started

### Prerequisites

1. [Postman](https://www.postman.com/downloads/) installed on your machine
2. Banking API running locally or on a server

### Importing the Collection

1. Open Postman
2. Click the "Import" button in the top left corner
3. Select the `banking-api-postman-collection.json` file from this directory
4. Click "Import"

### Setting Up Environment Variables

1. Click the "Import" button again
2. Select the `banking-api-postman-environment.json` file
3. Click "Import"
4. In the top right corner of Postman, select the "Banking API" environment from the dropdown

## Environment Variables

The collection uses the following environment variables:

- `baseUrl`: The base URL of the API (default: `http://localhost:3000/api`)
- `accessToken`: JWT access token (automatically set during authentication)
- `refreshToken`: JWT refresh token (automatically set during authentication)
- `userId`: The ID of the currently authenticated user (automatically set)
- `checkoutId`: ID of a created checkout session (automatically set)
- `paymentId`: ID of a created payment (automatically set)

## Authentication Flow

Before using the API endpoints, you need to authenticate:

1. Go to the "Auth" folder in the collection
2. Send the "Register" request with your details (if you don't have an account)
   ```json
   {
     "email": "your.email@example.com",
     "username": "your_username",
     "fullName": "Your Name",
     "password": "your_password"
   }
   ```
3. Send the "Login" request with your credentials
   ```json
   {
     "email": "your.email@example.com",
     "password": "your_password"
   }
   ```
4. The collection will automatically save the access and refresh tokens

If your access token expires, use the "Refresh Token" endpoint to get a new one.

## Using Pre-request Scripts

Many requests in the collection use pre-request scripts to:

1. Ensure authentication is valid
2. Set required parameters
3. Prepare request data

These scripts run automatically before each request.

## Testing with the Collection

### User Endpoints

The "Users" folder contains endpoints for:
- Getting the current user's profile
- Viewing wallet balances
- Updating profile information

### Card Management

The "Cards" folder contains endpoints for:
- Adding a new payment card
- Listing all cards
- Setting a default card
- Deleting a card

### Checkout Process

The "Checkouts" folder contains endpoints for:
- Creating a new checkout session
- Selecting a payment method
- Getting checkout status

### Payment Processing

The "Payments" folder lets you:
- Process payments using different methods
- Check payment status
- View payment history

### Receipts

The "Receipts" folder contains endpoints for:
- Retrieving transaction receipts
- Sending receipts via email

### Notifications

The "Notifications" folder contains endpoints for:
- Listing user notifications
- Marking notifications as read

### Reviews

The "Reviews" folder contains endpoints for:
- Submitting merchant reviews
- Viewing and editing reviews

## Response Examples

Each request in the collection includes example responses to help you understand the expected data format.

## Troubleshooting

If you encounter issues:

1. Ensure the API server is running
2. Check that environment variables are properly set
3. Verify your access token is valid
4. Look for error messages in the response

## Advanced Usage

### Collection Runner

You can use Postman's Collection Runner to run a series of requests in sequence, which is helpful for testing entire workflows.

### Newman CLI

For automated testing, you can use Newman (Postman's CLI):

```bash
npm install -g newman
newman run banking-api-postman-collection.json -e banking-api-postman-environment.json
```

## API Rate Limits

Be aware of the API's rate limits:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users 