# Truck Expense Tracker — Server Backend

This directory contains the Express/Mongoose backend for the Truck Expense Tracker application.

## Overview

The backend is built with:

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Role-based access control
- Swagger API documentation
- Jest tests with a MongoDB test database

The backend exposes REST APIs for:

- authentication
- drivers
- trucks
- trips
- expenses
- dashboard metrics

## Architecture

### Key layers

- `src/server.js` — application entry point that starts the HTTP server and loads environment configuration.
- `src/app.js` — Express application setup, middleware registration, route mounting, and error handling.
- `src/routes/` — route definitions for each endpoint group.
- `src/controller/` — controller functions that handle request/response and call service methods.
- `src/services/` — business logic and data access; services interact with Mongoose models.
- `src/models/` — Mongoose schemas and models for User, Truck, Trip, Expense.
- `src/middleware/` — reusable request middleware such as authentication, roles, and centralized error handling.
- `src/errors/ApiError.js` — standardized error classes used by services and controllers.
- `src/swagger.js` — OpenAPI schema and Swagger UI configuration.

### Validation and error handling

- `express-validator` is used in route validators to enforce request shapes.
- Services throw custom errors like `BadRequestError`, `NotFoundError`, and `ForbiddenError`.
- `error.middleware.js` converts these into clean HTTP responses.

### Authentication

- JWT is issued on registration and login.
- Protected endpoints require `Authorization: Bearer <token>`.
- User roles are `admin` and `driver`.
- Driver-specific behavior is enforced in services for trip and expense access.

## Setup

### Prerequisites

- Node.js 18+ (or the Node version configured in CI)
- npm
- MongoDB running locally or a connection string

### Install dependencies

From the `server/` folder:

```bash
cd server
npm install
```

### Environment variables

Create a `.env` file in `server/` or set environment variables externally.

Required values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/truck_expense_tracker
JWT_SECRET=your_jwt_secret
```

### Start the server

```bash
cd server
npm start
```

The server uses `src/server.js` and mounts routes under `/api`.

## API documentation

Swagger UI is available at:

```text
http://localhost:5000/api/docs
```

API JSON schema is available at:

```text
http://localhost:5000/api/docs.json
```

## Key endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Drivers

- `GET /api/drivers`
- `GET /api/drivers/:id`
- `POST /api/drivers`
- `PUT /api/drivers/:id`
- `DELETE /api/drivers/:id`

### Trucks

- `GET /api/trucks`
- `GET /api/trucks/:id`
- `POST /api/trucks`
- `PUT /api/trucks/:id`
- `DELETE /api/trucks/:id`

### Trips

- `GET /api/trips`
- `GET /api/trips/:id`
- `POST /api/trips`
- `PUT /api/trips/:id`
- `DELETE /api/trips/:id`

### Expenses

- `GET /api/expenses`
- `POST /api/expenses`
- `GET /api/dashboard` (aggregated metrics)

## Testing

### Local tests

Tests use Jest and by default will run against an in-memory MongoDB instance.

```bash
cd server
npm test
```

### CI tests

CI uses a dedicated MongoDB service with `MONGO_URL`.

In CI, the test bootstrap reads `process.env.MONGO_URL` and connects to that database instead of spinning up `mongodb-memory-server`.

## Notes for frontend integration

- The backend returns standard JSON envelopes: `success`, `data`, `message`, and `meta`.
- Use the `Authorization` header with the JWT token for protected routes.
- The `dashboard` endpoint can be used to power summary cards.
- Driver users are restricted to their own trips and expenses.

## Troubleshooting

### CI failures with `mongodb-memory-server`

If GitHub Actions fails with a missing OpenSSL library, the workflow is configured to use a real MongoDB service instead.

### Common model requirements

- Truck requires `number`, `model`, `licensePlate`.
- Trip requires `truckId`, `driverId`, `source`, `destination`, `loadType`, `income`, `departureDate`.
- Expense requires `tripId`, `type`, `amount`, `date`, `paidBy`, `createdBy`.

## File structure

```
server/
  src/
    app.js
    server.js
    routes/
    controller/
    services/
    models/
    middleware/
    errors/
    swagger.js
  test/
    setup.js
    auth.service.test.js
    driver.service.test.js
    truck.service.test.js
    expense.service.test.js
    trip_expense_dashboard.test.js
  package.json
  jest.config.js
  README.md
```

## How to contribute

- Add new validators in `src/validators`
- Keep business rules in `src/services`
- Expose routes only from `src/routes`
- Keep controllers thin and delegate to services
- Add tests under `server/test`
