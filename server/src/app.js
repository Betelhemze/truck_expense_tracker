const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const driverRoutes = require("./routes/driver.routes");
const truckRoutes = require("./routes/truck.routes");
const tripRoutes = require("./routes/trip.routes");
const expenseRoutes = require("./routes/expense.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const app = express();

app.use(cors());
app.use(express.json());


/*app.get("/", (req, res) => {
    res.send("truck expenxe tracker api running");

});*/



//routes 
app.use("/api/auth",authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);


module.exports = app;