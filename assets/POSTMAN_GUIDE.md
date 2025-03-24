# Banking API - Postman Collection Guide

This guide explains how to use the Banking API Postman collection to interact with the API endpoints.

## Getting Started

1. Download [Postman](https://www.postman.com/downloads/) if you haven't already
2. Import the `banking-api-postman-collection.json` file into Postman:
   - Open Postman
   - Click "Import" in the top left
   - Drag and drop the collection file or browse to select it
   - Click "Import"

## Setting Up Environment Variables

Before using the collection, you should set up environment variables:

1. Click the "Environments" tab in Postman
2. Click "Create New Environment" and give it a name (e.g., "Banking API - Local")
3. Add the following variable:
   - `baseUrl`: `http://localhost:3000/api` (or your server URL)
4. Save the environment and select it from the environment dropdown in the top right corner

## Authentication Flow

Many endpoints require authentication. Follow these steps to authenticate:

1. Use the "Register" endpoint to create a new user account
2. Use the "Login" endpoint to obtain an access token
3. The `accessToken` variable will be automatically set if you have the following test script in the Login request:

```javascript
// Add this to the Tests tab in the Login request
var jsonData = pm.response.json();
pm.environment.set("accessToken", jsonData.accessToken);
pm.environment.set("refreshToken", jsonData.refreshToken);
```

## API Endpoints Overview

### Auth Endpoints
- **Register**: Create a new user account
- **Login**: Authenticate and get access tokens
- **Refresh Token**: Get new access token using refresh token

### User Endpoints
- **Get User Profile**: Retrieve user information
- **Update User Profile**: Update user information
- **Get Wallet Balance**: Get user's wallet balances (GBP, crypto, tokens)

### Card Endpoints
- **Get User Cards**: Retrieve all user's cards
- **Get Card by ID**: Get details of a specific card
- **Add New Card**: Add a new card to the user's account
- **Update Card**: Update card information (e.g., set as default)
- **Delete Card**: Remove a card from the user's account

### Checkout Endpoints
- **Create Checkout**: Start a new checkout process
- **Get Checkout by ID**: Retrieve checkout details
- **Select Payment Method**: Choose a payment method for checkout

### Payment Endpoints
- **Create Payment**: Process payment for a checkout
- **Get Payment by ID**: Get details of a specific payment
- **Get User Payments**: Retrieve all user's payments

### Receipt Endpoints
- **Get Receipt by ID**: Get details of a specific receipt
- **Get User Receipts**: Retrieve all user's receipts
- **Send Receipt Email**: Send a receipt to user's email

### Notification Endpoints
- **Get User Notifications**: Retrieve all user's notifications
- **Mark Notification as Read**: Mark a specific notification as read
- **Mark All Notifications as Read**: Mark all notifications as read

### Review Endpoints
- **Create Review**: Submit a review for a payment
- **Get User Reviews**: Retrieve all reviews created by the user
- **Get Review by ID**: Get details of a specific review
- **Update Review**: Modify an existing review

## Working with Dynamic Variables

The collection uses Postman variables to store resource IDs. After creating resources with POST requests, the IDs will be automatically captured if you add the appropriate test scripts:

```javascript
// Example for capturing a card ID after creation
var jsonData = pm.response.json();
pm.environment.set("cardId", jsonData.id);
```

## Typical Workflow Example

1. Register a new user
2. Login to get access token
3. Add a new card
4. Create a checkout
5. Select a payment method
6. Process the payment
7. View the receipt
8. Submit a review

## Troubleshooting

If you encounter errors:

1. Ensure the server is running
2. Check that the `baseUrl` environment variable is correct
3. Verify you have a valid access token for protected endpoints
4. Check request payloads for correct formatting
5. Look for error messages in the response body

For persistent issues, check the server logs or contact the API administrator. 