require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const logger = require("./config/logger");
const { Worker } = require("worker_threads");
// Mongodb connectiobn middleware
const connectToMongoDB = require("./config/mongoose");
connectToMongoDB();

// common middleware
const middleware = require("./middlewares/middleware");
app.use(middleware);

// Auth routes
const authRouter = require("./routes/authRoutes");
app.use("/auth", authRouter);

// file handle routes
const fileRouter = require("./routes/fileRoutes");
app.use(fileRouter);

// User Management routes
const userRouter = require("./routes/userRoutes");
app.use("/users", userRouter);

// RBAC ROUTES
const rbacRouter = require("./routes/rbacRoutes");
app.use("/rbac", rbacRouter);

// Profile ROUTES
const profileRouter = require("./routes/profileRoutes");
app.use("/profile", profileRouter);

// Vehicles Route
const vehicleRouter = require("./routes/vehicleRoutes");
app.use("/vehicle", vehicleRouter);

// STS Route
const stsRouter = require("./routes/stsRoutes");
app.use("/sts", stsRouter);

// Landfill Route
const landfillRouter = require("./routes/landfillRoutes");
app.use("/landfill", landfillRouter);

// STS Manager Route
const stsManagerRoutes = require("./routes/stsManagerRoutes");
app.use("/sts-manager", stsManagerRoutes);

// Landfill Manager Route
const landfillManagerRoutes = require("./routes/landfillManagerRoutes");
app.use("/landfill-manager", landfillManagerRoutes);

// Billing Route
const billingRoutes = require("./routes/billingRoutes");
app.use("/billing", billingRoutes);

// Dashboard Route
const dashboardRoutes = require("./routes/dashboardRoute");
app.use("/dashboard", dashboardRoutes);

// thirdpartyRoutes
const thirdpartyCompanyRoutes = require("./routes/thirdpartyRoutes");
app.use("/thirdparty", thirdpartyCompanyRoutes);

// Wards Routes
const wardRoutes = require("./routes/wardRoutes");
app.use("/ward", wardRoutes);

// workforce route
const workforceRoute = require("./routes/workforceRoute");
app.use("/workforce", workforceRoute);

// Default
app.get("/", (req, res) => {
  res.send("EcoSync is currently running");
});
app.listen(PORT, () => {
  console.log(`EcoSync Server is running on port ${PORT}`);
  logger.info(`EcoSync Server is running on port ${PORT}`);
});
