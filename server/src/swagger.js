module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Truck Expense Tracker API",
    version: "1.0.0",
    description: "API documentation for the Truck Expense Tracker backend.",
  },
  servers: [
    {
      url: "/",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string" },
          phone: { type: "string" },
          licenseNumber: { type: "string" },
        },
      },
      AuthRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["fullName", "email", "password", "role"],
        properties: {
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
          role: { type: "string", enum: ["admin", "driver"] },
          phone: { type: "string" },
          licenseNumber: { type: "string" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/User" },
              token: { type: "string" },
            },
          },
        },
      },
      DriverCreateRequest: {
        type: "object",
        required: ["fullName", "email", "password", "phone", "licenseNumber"],
        properties: {
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
          phone: { type: "string" },
          licenseNumber: { type: "string" },
        },
      },
      Truck: {
        type: "object",
        properties: {
          _id: { type: "string" },
          number: { type: "string" },
          model: { type: "string" },
          capacity: { type: "number" },
          driverId: { type: "string" },
          status: { type: "string" },
        },
      },
      Trip: {
        type: "object",
        properties: {
          _id: { type: "string" },
          truckId: { type: "string" },
          driverId: { type: "string" },
          origin: { type: "string" },
          destination: { type: "string" },
          income: { type: "number" },
          status: { type: "string" },
          startDate: { type: "string", format: "date" },
          endDate: { type: "string", format: "date" },
        },
      },
      Expense: {
        type: "object",
        properties: {
          _id: { type: "string" },
          tripId: { type: "string" },
          type: { type: "string" },
          amount: { type: "number" },
          description: { type: "string" },
          date: { type: "string", format: "date" },
          paidBy: { type: "string" },
          createdBy: { type: "string" },
        },
      },
      ExpenseRequest: {
        type: "object",
        required: ["tripId", "type", "amount", "date", "paidBy"],
        properties: {
          tripId: { type: "string" },
          type: { type: "string" },
          amount: { type: "number" },
          description: { type: "string" },
          date: { type: "string", format: "date" },
          paidBy: { type: "string" },
        },
      },
      DashboardSummary: {
        type: "object",
        properties: {
          totalIncome: { type: "number" },
          totalExpenses: { type: "number" },
          totalProfit: { type: "number" },
          totalTrips: { type: "number" },
          activeTrips: { type: "number" },
          completedTrips: { type: "number" },
        },
      },
      ExpenseBreakdown: {
        type: "object",
        additionalProperties: { type: "number" },
      },
      TripProfitResponse: {
        type: "object",
        properties: {
          tripIncome: { type: "number" },
          totalExpenses: { type: "number" },
          profit: { type: "number" },
        },
      },
      RecentTripsResponse: {
        type: "array",
        items: { $ref: "#/components/schemas/Trip" },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive a JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          400: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current user details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/drivers": {
      get: {
        tags: ["Drivers"],
        summary: "Get list of drivers",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of drivers",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/User" },
                    },
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "number" },
                        page: { type: "number" },
                        limit: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Drivers"],
        summary: "Create a new driver",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DriverCreateRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Driver created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/drivers/{id}": {
      get: {
        tags: ["Drivers"],
        summary: "Get a driver by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Driver details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          404: {
            description: "Driver not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Drivers"],
        summary: "Update a driver",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullName: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  licenseNumber: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Driver updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          404: {
            description: "Driver not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Drivers"],
        summary: "Delete a driver",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Driver deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          404: {
            description: "Driver not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/trucks": {
      get: {
        tags: ["Trucks"],
        summary: "Get all trucks",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of trucks",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Truck" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Trucks"],
        summary: "Create a truck",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  number: { type: "string" },
                  model: { type: "string" },
                  capacity: { type: "number" },
                  driverId: { type: "string" },
                  status: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Truck created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Truck" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/trucks/{id}": {
      get: {
        tags: ["Trucks"],
        summary: "Get a truck by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Truck details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Truck" },
                  },
                },
              },
            },
          },
          404: {
            description: "Truck not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Trucks"],
        summary: "Update a truck",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  number: { type: "string" },
                  model: { type: "string" },
                  capacity: { type: "number" },
                  driverId: { type: "string" },
                  status: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Truck updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Truck" },
                  },
                },
              },
            },
          },
          404: {
            description: "Truck not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Trucks"],
        summary: "Delete a truck",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Truck deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          404: {
            description: "Truck not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/trips": {
      get: {
        tags: ["Trips"],
        summary: "Get all trips",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of trips",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Trip" },
                    },
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "number" },
                        page: { type: "number" },
                        limit: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Trips"],
        summary: "Create a trip",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Trip" },
            },
          },
        },
        responses: {
          201: {
            description: "Trip created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Trip" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/trips/{id}": {
      get: {
        tags: ["Trips"],
        summary: "Get a trip by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Trip details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Trip" },
                  },
                },
              },
            },
          },
          404: {
            description: "Trip not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Trips"],
        summary: "Update a trip",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Trip" },
            },
          },
        },
        responses: {
          200: {
            description: "Trip updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Trip" },
                  },
                },
              },
            },
          },
          404: {
            description: "Trip not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Trips"],
        summary: "Delete a trip",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Trip deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          404: {
            description: "Trip not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/expenses": {
      get: {
        tags: ["Expenses"],
        summary: "Get all expenses",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of expenses",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Expense" },
                    },
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "number" },
                        page: { type: "number" },
                        limit: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Expenses"],
        summary: "Add an expense",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExpenseRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Expense added",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    data: { $ref: "#/components/schemas/Expense" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/expenses/trip/{tripId}": {
      get: {
        tags: ["Expenses"],
        summary: "Get expenses for a trip",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "tripId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Trip expenses",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Expense" },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Trip not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/dashboard/summary": {
      get: {
        tags: ["Dashboard"],
        summary: "Get dashboard summary",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dashboard summary",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/DashboardSummary" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/dashboard/expense-breakdown": {
      get: {
        tags: ["Dashboard"],
        summary: "Get expense breakdown",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Expense breakdown",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/ExpenseBreakdown" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/dashboard/trip-profit/{tripId}": {
      get: {
        tags: ["Dashboard"],
        summary: "Get profit for a single trip",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "tripId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Trip profit",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/TripProfitResponse" },
                  },
                },
              },
            },
          },
          404: {
            description: "Trip not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/dashboard/recent-trips": {
      get: {
        tags: ["Dashboard"],
        summary: "Get recent trips",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Recent trips",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/RecentTripsResponse" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/test/admin": {
      get: {
        tags: ["Test"],
        summary: "Admin-only test endpoint",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Admin welcome message",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};
