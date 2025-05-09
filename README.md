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
- File upload support
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

#### POST /gateway/:service
Handles requests to different services with file upload support. Requires authentication.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Parameters:**
- `service` (path parameter): The target service to route the request to
  - Available services: service1, service2, service3, service4

**Request Body:**
- `file` (multipart/form-data): File to be uploaded
- `text` (form-data): Text content to be processed

**Example Requests:**

1. Using cURL:
```bash
curl -X POST http://localhost:3000/gateway/service1 \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "file=@/path/to/file" \
  -F "text=your text content"
```

2. Using Postman:
- Method: POST
- URL: `http://localhost:3000/gateway/service1`
- Headers:
  ```
  Authorization: Bearer <your_jwt_token>
  ```
- Body (form-data):
  - Key: `file` (Type: File) - Select your file
  - Key: `text` (Type: Text) - Enter your text content

3. Using JavaScript/Fetch:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('text', 'your text content');

fetch('http://localhost:3000/gateway/service1', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <your_jwt_token>'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

4. Using Axios:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('text', 'your text content');

axios.post('http://localhost:3000/gateway/service1', formData, {
  headers: {
    'Authorization': 'Bearer <your_jwt_token>',
    'Content-Type': 'multipart/form-data'
  }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

**Response:**
```json
{
  "text": "combined text content from input and parsed file"
}
```

**Error Responses:**

1. Unauthorized (No Token):
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

2. Invalid Token:
```json
{
  "statusCode": 401,
  "message": "Invalid token"
}
```

3. Invalid Service:
```json
{
  "statusCode": 400,
  "message": "Invalid service name"
}
```

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
