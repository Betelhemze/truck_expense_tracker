const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const driverRoutes = require("./routes/driver.routes");
const truckRoutes = require("./routes/truck.routes");
const tripRoutes = require("./routes/trip.routes");
const expenseRoutes = require("./routes/expense.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const reportRoutes = require("./routes/report.routes");
const uploadRoutes = require("./routes/upload.routes");
const errorHandler = require("./middleware/error.middleware");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs.json", (req, res) => res.json(swaggerSpec));
app.use("/uploads", express.static("uploads"));

/*app.get("/", (req, res) => {
    res.send("truck expenxe tracker api running");

});*/

//routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/upload", uploadRoutes);

app.use(errorHandler);
module.exports = app;
