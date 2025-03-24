# Banking API Documentation

This directory contains comprehensive documentation for the Banking API, including database schema diagrams and API endpoint specifications.

## Contents

1. **Database Schema**
   - `banking-api-schema.drawio`: Draw.io diagram showing the database entities and their relationships.
   - `banking-api-schema.png`: Static image of the database schema.
   - Open the .drawio file at [draw.io](https://app.diagrams.net/) to view and edit.

2. **Postman Collection**
   - `banking-api-postman-collection.json`: Complete Postman collection with all API endpoints.
   - `banking-api-postman-environment.json`: Environment variables for use with the collection.
   - `POSTMAN_GUIDE.md`: Guide for setting up and using the Postman collection.

## Database Schema Overview

The Banking API database consists of the following main entities:

- **User**: Core user account information and wallet balances
- **Card**: Saved payment cards linked to user accounts
- **Checkout**: Shopping cart/checkout sessions
- **Payment**: Payment transactions 
- **Receipt**: Transaction receipts generated after payments
- **Notification**: System notifications for users
- **Review**: User reviews of merchants after purchases

All entities inherit from a BaseEntity that provides common fields like ID, created time, and updated time.

## API Endpoints Overview

The API is organized into the following resource groups:

### Authentication
- User registration
- Login/token generation
- Token refresh

### User Management
- Profile handling
- Wallet balance information

### Card Management
- CRUD operations for payment cards

### Checkout Process
- Create checkout sessions
- Select payment methods

### Payment Processing
- Process payments through various methods
- Payment status tracking

### Receipt Handling
- Retrieve receipts
- Email receipts to users

### Notification System
- Retrieve user notifications
- Mark notifications as read

### Review System
- Submit merchant reviews
- Retrieve and update reviews

## Getting Started

1. Import the Postman collection and environment files into Postman
2. Set up your environment variables
3. Follow the authentication flow to get access tokens
4. Explore the various API endpoints

For detailed instructions, see the `POSTMAN_GUIDE.md` file.

## Postman Collection Structure

The Postman collection is organized into logical folders representing different areas of functionality:

- Auth
- Users
- Cards
- Checkouts
- Payments
- Receipts
- Notifications
- Reviews

Each folder contains relevant API endpoints with sample request bodies and descriptions.

## Security & Authentication

Most API endpoints require authentication via JWT (JSON Web Tokens). The authentication flow is:

1. Register a new user account
2. Login to obtain access and refresh tokens
3. Include the access token in the Authorization header of subsequent requests
4. Use the refresh token endpoint when the access token expires

## Data Models

The API uses the following core data models:

### User
```json
{
  "id": "uuid",
  "email": "string",
  "username": "string",
  "fullName": "string",
  "gbpWalletBalance": "number",
  "cryptoBalance": "number",
  "snTokenBalance": "number",
  "notificationCount": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Card
```json
{
  "id": "uuid",
  "cardHolderName": "string",
  "lastFourDigits": "string",
  "cardType": "enum(visa, mastercard, amex)",
  "expiryMonth": "string",
  "expiryYear": "string",
  "isDefault": "boolean",
  "userId": "uuid",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Checkout
```json
{
  "id": "uuid",
  "amount": "number",
  "merchantName": "string",
  "merchantId": "string",
  "status": "enum(pending, processing, completed, failed)",
  "selectedPaymentMethod": "enum(credit_card, crypto, sn_tokens, gbp_wallet)",
  "qrCodeData": "string",
  "userId": "uuid",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Payment
```json
{
  "id": "uuid",
  "amount": "number",
  "status": "enum(initiated, processing, completed, failed)",
  "paymentMethod": "enum(credit_card, crypto, sn_tokens, gbp_wallet)",
  "transactionReference": "string",
  "cardLastFour": "string",
  "checkoutId": "uuid",
  "userId": "uuid",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Receipt
```json
{
  "id": "uuid",
  "receiptNumber": "string",
  "merchantName": "string",
  "transactionDate": "datetime",
  "amount": "number",
  "paymentMethod": "string",
  "paymentStatus": "string",
  "items": "json",
  "emailSent": "boolean",
  "paymentId": "uuid",
  "userId": "uuid",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Notification
```json
{
  "id": "uuid",
  "title": "string",
  "content": "string",
  "type": "enum(payment_pending, payment_completed, new_card_added, review_reminder)",
  "isRead": "boolean",
  "referenceId": "string",
  "userId": "uuid",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Review
```json
{
  "id": "uuid",
  "rating": "number",
  "title": "string",
  "content": "string",
  "merchantName": "string",
  "emailSent": "boolean",
  "userId": "uuid",
  "paymentId": "uuid",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## Error Handling

The API returns appropriate HTTP status codes along with error messages:

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "Bad Request"
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Support

For additional support or questions about the API, please contact the API administrator. 