# NestJS Gateway

A modern API Gateway built with NestJS framework, designed to handle and route requests efficiently.

## Description

This project is a NestJS-based API Gateway that serves as an entry point for client applications. It's built using the latest version of NestJS (v11) and follows best practices for API gateway implementation.

## Features

- Built with NestJS v11
- Express.js as the underlying HTTP framework
- JSON request body size limit of 10MB
- TypeScript support
- MongoDB integration for user management
- JWT-based authentication
- File upload support with type validation
- Multiple service routing capabilities
- Comprehensive testing setup with Jest
- ESLint and Prettier for code formatting
- Development and production configurations

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- MongoDB running locally or accessible URL

## Installation

```bash
# Clone the repository
git clone [your-repository-url]

# Navigate to the project directory
cd nestjs-gateway

# Install dependencies
npm install
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## Available Scripts

- `npm run build` - Build the application
- `npm run format` - Format code using Prettier
- `npm run start` - Start the application
- `npm run start:dev` - Start the application in watch mode
- `npm run start:debug` - Start the application in debug mode
- `npm run start:prod` - Start the application in production mode
- `npm run lint` - Lint the code
- `npm run test` - Run unit tests
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:cov` - Run unit tests with coverage
- `npm run test:debug` - Run unit tests in debug mode
- `npm run test:e2e` - Run end-to-end tests

## Project Structure

```
src/
├── auth/           # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── jwt.strategy.ts
├── users/          # User management module
│   ├── schemas/
│   ├── dto/
│   ├── users.service.ts
│   └── users.module.ts
├── gateway/        # Gateway module
│   ├── gateway.controller.ts
│   ├── gateway.service.ts
│   └── gateway.module.ts
├── common/         # Common utilities
│   ├── validators/
│   └── constants.ts
├── app.module.ts   # Root application module
└── main.ts         # Application entry point
```

## API Documentation

The API Gateway runs on port 3000 by default. You can access it at `http://localhost:3000`.

### Authentication Endpoints

#### POST /auth/register
Register a new user and get authentication token.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string (min length: 6)"
}
```

**Response:**
```json
{
  "access_token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "username": "string"
  }
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "username": "string"
  }
}
```

### Gateway Endpoints

All gateway endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### POST /gateway/service1
Handles requests for service1. Accepts an optional file and optional text data.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
- `file` (optional): File to be uploaded. See supported file types below.
- `text` (optional): Text content related to the file or standalone.

**Example Request (cURL):**
```bash
curl -X POST http://localhost:3000/gateway/service1 \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "file=@/path/to/your/file.txt" \
  -F "text=Sample text content for service1"
```

#### POST /gateway/service2
Handles requests for service2. Accepts a JSON payload with journal entries and optional additional context.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body (JSON):**
```json
{
  "journal_entries": [
    { "account": "string", "debit": "number", "credit": "number" },
    { "account": "string", "debit": "number", "credit": "number" }
  ],
  "additional_context": "string (optional)"
}
```

**Example Request (cURL):**
```bash
curl -X POST http://localhost:3000/gateway/service2 \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
        "journal_entries": [
          { "account": "ACC001", "debit": 100, "credit": 0 },
          { "account": "ACC002", "debit": 0, "credit": 100 }
        ],
        "additional_context": "Monthly financial closing entries"
      }'
```

#### POST /gateway/service3
Handles requests for service3. Accepts an optional file and optional text data.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
- `file` (optional): File to be uploaded. See supported file types below.
- `text` (optional): Text content.

**Example Request (cURL):**
```bash
curl -X POST http://localhost:3000/gateway/service3 \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "file=@/path/to/another/file.pdf" \
  -F "text=Further context for service3"
```

**Supported File Types (for service1 and service3):**
- PDF (.pdf)
- Microsoft Word (.docx, .doc)
- Microsoft Excel (.xlsx, .xls)
- Microsoft PowerPoint (.pptx, .ppt)
- OpenDocument Text (.odt)
- OpenDocument Spreadsheet (.ods)
- OpenDocument Presentation (.odp)
- Text files (.txt)
- Markdown (.md)
- CSV (.csv)
- JSON (.json)
- XML (.xml)
- HTML (.html, .htm)
- Rich Text Format (.rtf)

### Service Endpoints

The gateway routes requests to the following services:

#### AI Services
| Service Name | Endpoint URL |
|--------------|--------------|
| Service 1    | `http://localhost:8001/analyze` |
| Service 2    | `http://localhost:8002/analyze` |
| Service 3    | `http://localhost:8003/analyze` |
| Service 4    | `http://localhost:8004/analyze` |

#### Document Parser
| Service Name | Endpoint URL |
|--------------|--------------|
| Document Parser | `http://localhost:9000/parse` |

### Validation Requirements

#### User Registration and Login
- **Username:**
  - Required
  - Must be a string
- **Email:**
  - Required
  - Must be a valid email address (RFC 5322 compliant)
  - Must be unique in the system
- **Password:**
  - Required
  - Must be a string
  - Minimum length: 6 characters

#### File Upload Validation
- File type must be one of the supported formats
- File must be valid and readable
- File must contain extractable text content

#### Example Validation Errors
```json
{
  "statusCode": 400,
  "message": [
    "Username is required",
    "Please provide a valid email address",
    "Password must be at least 6 characters long"
  ],
  "error": "Bad Request"
}
```

## Testing

The project uses Jest as its testing framework. You can run tests using the following commands:

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License - see the package.json file for details.
