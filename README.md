# SaaS Microservices Architecture (SMA) Framework

## Overview

The SaaS Microservices Architecture (SMA) Framework is a comprehensive, production-ready suite of microservices designed to accelerate the development of Software-as-a-Service (SaaS) applications. This framework provides a collection of pre-implemented, reusable modules that address common SaaS functionalities, allowing developers to focus on building their core business logic.

## Key Features

- **Modular Architecture**: Each functionality is encapsulated in its own microservice, promoting scalability and maintainability.
- **Interoperability**: Seamless integration between services using standardized communication protocols.
- **Third-party Integrations**: Pre-configured connections with industry-leading services for critical functionalities.
- **Advanced Authentication System**: Multi-faceted auth service supporting various authentication methods.
- **Scalability**: Designed to handle growth from startup to enterprise-level operations.

## Microservices Overview

### 1. Authentication Service

Our robust authentication service supports multiple authentication strategies:

- **Email/Password**: Traditional username and password authentication.
- **Passwordless**: Email-based authentication using one-time codes.
- **TOTP (Time-based One-Time Password)**: Two-factor authentication with recovery keys.
- **Passkey**: WebAuthn-based authentication, also supporting recovery keys.
- **OAuth**: Integrated with GitHub OAuth for social login.

#### Key Authentication Features:

- JWT-based authentication with access and refresh tokens.
- Refresh token revocation for secure logout functionality.
- Recovery key support for TOTP and Passkey methods.

### 2. User Management Service

Handles user profiles, roles, and permissions.

### 3. Payment Service

Integrated with Stripe for secure and scalable payment processing.

### 4. Email Service

Utilizes Resend for reliable email delivery, supporting transactional and marketing emails.

### 5. File Management Service

Secure file upload, storage, and retrieval system.

### 6. Logging and Monitoring Service

Centralized logging and monitoring for all microservices.

### 7. API Gateway

Single entry point for all client requests, handling routing and rate limiting.

## Authentication Deep Dive

### Email/Password Authentication

- Secure password hashing using bcrypt.
- Email verification flow for new registrations.

### Passwordless Authentication

- Generates time-limited one-time codes.
- Delivers codes via email using the Email Service.

### TOTP (Two-Factor Authentication)

- Implements RFC 6238 for time-based OTP.
- Provides QR code for easy setup with authenticator apps.
- Includes recovery keys for account access if device is lost.

### Passkey Authentication

- Implements the WebAuthn standard for passwordless authentication.
- Supports various authenticators including biometric and hardware security keys.
- Includes recovery mechanism for lost devices.

### OAuth Integration

- Currently supports GitHub OAuth.
- Easily extendable to other OAuth providers.

### Token Management

- Issues short-lived JWT access tokens and longer-lived refresh tokens.
- Implements refresh token rotation for enhanced security.
- Supports token revocation for immediate logout across devices.

## Integrations

- **Email**: Integrated with Resend for high-deliverability email services.
- **Payments**: Stripe integration for secure payment processing and subscription management.
- **OAuth**: GitHub OAuth for social login, expandable to other providers.

## Getting Started

Follow these steps to set up and run the SMA Framework on your local development environment.

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)
- Git

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-repo/sma-framework.git
   cd sma-framework
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   - Copy the `.env.template` file to a new file named `.env`:
     ```
     cp .env.template .env
     ```
   - Open the `.env` file and fill in the required values. Refer to the comments in the file for guidance on each variable.

4. Set up the PostgreSQL database:

   - Create a new PostgreSQL database for the project.
   - Update the `DATABASE_URL` in your `.env` file with your PostgreSQL connection string.

5. Run database migrations:
   ```
   npx prisma migrate dev
   ```

### Running the Application

To start the NestJS application, run:

```
npm run start
```

For development with auto-reload, use:

```
npm run start:dev
```

### Running Individual Microservices

To run a specific microservice, use:

```
npm run start:dev -- --app=<microservice-name>
```

Replace `<microservice-name>` with the name of the microservice you want to run (e.g., auth, user, payment).

### Verifying the Setup

1. Once the application is running, you can verify the setup by accessing the health check endpoint:

   ```
   curl http://localhost:3000/health
   ```

   You should receive a JSON response indicating the service is up and running.

2. To test the authentication service, you can try registering a new user:
   ```
   curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "securepassword"}'
   ```

### Next Steps

- Explore the API documentation available at `http://localhost:3000/api` (if Swagger is configured).
- Set up additional services like email (Resend) and payment (Stripe) by following their respective setup guides in the documentation.
- Review and customize the authentication flows to match your specific requirements.

## License

MIT License
